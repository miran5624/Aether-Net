const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { submitRating, getResponderRatings } = require('../controllers/ratingsController');

// All ratings routes are protected
router.use(protect);

router.post('/:sosId', submitRating);
router.get('/responder/:userId', getResponderRatings);

module.exports = router;
