const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    updateSkills,
    updateLocation,
    getNearbyUsers,
    addGuardian,
    removeGuardian,
    getGuardians,
    getPublicProfile,
} = require('../controllers/userController');

// All user routes are protected
router.use(auth);

// Profile routes
router.route('/profile')
    .get(getProfile)
    .put(updateProfile);

// Core app features
router.put('/skills', updateSkills);
router.put('/location', updateLocation);
router.get('/nearby', getNearbyUsers);

// Guardians routes
router.route('/guardians')
    .post(addGuardian)
    .get(getGuardians);

router.delete('/guardians/:guardianId', removeGuardian);

// Public profile fetching (for responders seeing a user's basic info)
router.get('/:id/public', getPublicProfile);

module.exports = router;
