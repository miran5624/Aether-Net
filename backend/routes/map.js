const express = require('express');
const router = express.Router();
const pointsOfInterest = require('../data/pointsOfInterest');
const { getNearbyResources } = require('../services/resourceService');

// GET /api/map/points-of-interest (static)
router.get('/points-of-interest', (req, res) => {
    res.json(pointsOfInterest);
});

// GET /api/map/resources?lat=28.6139&lng=77.2090
router.get('/resources', async (req, res) => {
    try {
        const { lat = 28.6139, lng = 77.2090 } = req.query;
        const resources = await getNearbyResources(parseFloat(lat), parseFloat(lng));
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources', error: error.message });
    }
});

module.exports = router;
