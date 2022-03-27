const express = require('express');

const router = express.Router();

//controllers
const { rateUser, deleteRating } = require('../controllers/rating');

//routes
router.post('/rate/user/:userId', rateUser);
router.post('/delete-rating/:ratingId', deleteRating);

module.exports = router;
