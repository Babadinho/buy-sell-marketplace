const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: false,
    },
    photo_id: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
    },
    location: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: 'user',
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'rating',
      },
    ],
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
      },
    ],
    newMessagePopup: {
      type: Boolean,
      default: false,
    },
    unreadNotification: {
      type: Boolean,
      default: false,
    },
    unreadMessage: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
