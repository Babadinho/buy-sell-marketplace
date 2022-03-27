const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  notifications: [
    {
      type: {
        type: String,
        enum: ['newFavorite', 'newComment', 'newFollower', 'newRating'],
      },
      status: {
        type: String,
        enum: ['read', 'unRead'],
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
      },
      ratingId: {
        type: Schema.Types.ObjectId,
        ref: 'rating',
      },
      ratedUser: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  currentNotificationCount: {
    type: Number,
  },
});

module.exports = mongoose.model('notification', NotificationSchema);
