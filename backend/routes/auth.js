const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('guardians', 'name email phone');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    const { name, phone, age, isPhysicallyDisabled, bloodGroup, healthConditions } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = name || user.name;
            user.phone = phone !== undefined ? phone : user.phone;
            user.age = age !== undefined ? age : user.age;
            user.isPhysicallyDisabled = isPhysicallyDisabled !== undefined ? isPhysicallyDisabled : user.isPhysicallyDisabled;
            user.bloodGroup = bloodGroup !== undefined ? bloodGroup : user.bloodGroup;
            user.healthConditions = healthConditions !== undefined ? healthConditions : user.healthConditions;

            const updatedUser = await user.save();
            const userToReturn = updatedUser.toObject();
            delete userToReturn.password;

            res.json(userToReturn);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user skills
// @route   PUT /api/users/skills
// @access  Private
const updateSkills = async (req, res) => {
    const { skills } = req.body;

    try {
        const validSkills = ['Medical', 'Car Diagnosis Skill', 'None'];
        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: 'Skills must be an array' });
        }

        const isValid = skills.every(skill => validSkills.includes(skill));
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid skills provided' });
        }

        const user = await User.findById(req.user._id);
        if (user) {
            user.skills = skills;
            const updatedUser = await user.save();

            const userToReturn = updatedUser.toObject();
            delete userToReturn.password;

            res.json(userToReturn);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user location
// @route   PUT /api/users/location
// @access  Private
const updateLocation = async (req, res) => {
    const { x, y } = req.body;

    if (typeof x !== 'number' || typeof y !== 'number' || x < 0 || x > 1000 || y < 0 || y > 1000) {
        return res.status(400).json({ message: 'Invalid coordinates. x and y must be numbers between 0 and 1000.' });
    }

    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.location = { x, y };
            const updatedUser = await user.save();

            const io = req.app.get('io');
            if (io) {
                io.emit('location:update', { userId: user._id, x, y });
            }

            res.json(updatedUser.location);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get nearby users
// @route   GET /api/users/nearby
// @access  Private
const getNearbyUsers = async (req, res) => {
    const x = parseFloat(req.query.x);
    const y = parseFloat(req.query.y);
    const radius = parseFloat(req.query.radius) || 500;

    if (isNaN(x) || isNaN(y)) {
        return res.status(400).json({ message: 'Please provide valid x and y coordinates' });
    }

    try {
        // Find online, non-suspended users
        const users = await User.find({ isOnline: true, isSuspended: false })
            .select('id name skills location trustScore isOnline');

        // Filter by Euclidean distance
        const nearbyUsers = users.filter(user => {
            const distance = Math.sqrt(Math.pow(user.location.x - x, 2) + Math.pow(user.location.y - y, 2));
            return distance <= radius;
        });

        res.json(nearbyUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a guardian
// @route   POST /api/users/guardians
// @access  Private
const addGuardian = async (req, res) => {
    const { guardianEmail } = req.body;

    if (!guardianEmail) {
        return res.status(400).json({ message: 'Please provide guardian email' });
    }

    if (req.user.email === guardianEmail.toLowerCase()) {
        return res.status(400).json({ message: 'Cannot add yourself as a guardian' });
    }

    try {
        const guardianUser = await User.findOne({ email: guardianEmail.toLowerCase() });

        if (!guardianUser) {
            return res.status(404).json({ message: 'User not found with this email' });
        }

        const currentUser = await User.findById(req.user._id);

        if (currentUser.guardians.includes(guardianUser._id)) {
            return res.status(400).json({ message: 'User is already a guardian' });
        }

        if (currentUser.guardians.length >= 5) {
            return res.status(400).json({ message: 'Maximum of 5 guardians allowed' });
        }

        currentUser.guardians.push(guardianUser._id);
        await currentUser.save();

        await currentUser.populate('guardians', 'name email phone');

        res.json(currentUser.guardians);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Remove a guardian
// @route   DELETE /api/users/guardians/:guardianId
// @access  Private
const removeGuardian = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        currentUser.guardians = currentUser.guardians.filter(
            (id) => id.toString() !== req.params.guardianId
        );

        await currentUser.save();

        await currentUser.populate('guardians', 'name email phone');

        res.json(currentUser.guardians);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get user guardians
// @route   GET /api/users/guardians
// @access  Private
const getGuardians = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('guardians', 'name email phone');
        if (user) {
            res.json(user.guardians);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get public profile
// @route   GET /api/users/:id/public
// @access  Private
const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('name skills trustScore isOnline location');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateSkills,
    updateLocation,
    getNearbyUsers,
    addGuardian,
    removeGuardian,
    getGuardians,
    getPublicProfile,
};
