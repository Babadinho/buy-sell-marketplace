const Rating = require('../models/Rating');
const User = require('../models/User');
const {
  newRatingNotification,
  removeRatingNotification,
} = require('./notification');

exports.rateUser = async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    //validation
    if (!rating) return res.status(400).send('Please select rating');
    if (!feedback)
      return res.status(400).send('Please enter a detailed feedback');

    const newRating = await new Rating(req.body);
    newRating.save();
    res.json(newRating);
    const user = await User.findById(req.params.userId);
    user.ratings.push(newRating._id);
    user.save();

    if (newRating.author.toString() !== req.params.userId) {
      await newRatingNotification(
        req.params.userId,
        newRating._id,
        newRating.author.toString()
      );
    }
  } catch (err) {
    console.log('RATE USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.deleteRating = async (req, res) => {
  try {
    // console.log(req.params.ratingId);
    // console.log(req.body.userId);
    const user = await User.findById(req.body.userId);
    if (user) {
      const ratingToDelete = user.ratings.indexOf(req.params.ratingId);
      user.ratings.splice(ratingToDelete, 1);
      await user.save();
    }
    const rating = await Rating.findById(req.params.ratingId);
    if (rating.author.toString() !== req.body.userId) {
      await removeRatingNotification(
        req.body.userId.toString(),
        rating._id.toString(),
        rating.author.toString()
      );
      await rating.remove();
    }
    await Rating.deleteOne({ _id: req.params.ratingId });
    return res.status(200).send('Rating Deleted');
  } catch (err) {
    console.log('DELETE RATING FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
