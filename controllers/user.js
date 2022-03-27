const User = require('../models/User');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary').v2;
const bcrypt = require('bcrypt');
const {
  newFollowerNotification,
  removeFollowerNotification,
} = require('./notification');

exports.userProfile = async (req, res) => {
  let user = await User.findById(req.params.userId)
    .populate([
      { path: 'ratings', populate: { path: 'author', select: '-password' } },
      { path: 'products', populate: { path: 'author', select: '-password' } },
      { path: 'products', populate: { path: 'category' } },
      { path: 'products', populate: { path: 'location' } },
    ])
    .exec();
  user.password = undefined;
  return res.json(user);
};
exports.userProfile2 = async (req, res) => {
  let user = await User.findById(req.params.userId)
    .populate([{ path: 'followers' }, { path: 'following' }])
    .exec();
  console.log(user.followers.length);
  user.password = undefined;
  return res.json(user);
};
exports.reduxUser = async (req, res) => {
  let user = await User.findById(req.params.userId)
    .populate([{ path: 'followers' }, { path: 'following' }])
    .exec();
  user.password = undefined;
  return res.json(user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, username, phone, location, photo, _id } = req.body;

    //Validate User
    const profileOwner = req.params.userId === _id;
    if (!profileOwner)
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    //validate fields
    if (!name || !email || !username || !phone)
      return res.status(400).send('All fields are required');

    //validate phone
    let phoneno = /^\d{11}$/;
    if (!phone.match(phoneno))
      return res.status(400).send('Phone number must be 11 characters long');
    //   const imageUrl = req.file ? req.file.path : undefined;

    const imageUrl =
      !photo || photo.substring(11, 21) === 'cloudinary'
        ? ''
        : await cloudinary.uploader.upload(photo, {
            public_id: getUser.photo_id,
            overwrite: true,
            invalidate: true,
            folder: 'buynsell/profileimages/',
          });

    let updatedUser = {
      name: name,
      email: email,
      username: username,
      phone: phone,
      photo:
        !photo || photo.substring(11, 21) === 'cloudinary'
          ? undefined
          : imageUrl.url,
      location: location,
      photo_id:
        !photo || photo.substring(11, 21) === 'cloudinary'
          ? undefined
          : imageUrl.public_id,
    };

    for (let prop in updatedUser)
      if (!updatedUser[prop]) delete updatedUser[prop];

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: updatedUser },
      { new: true, useFindAndModify: false }
    );
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
      photo: user.photo,
      role: user.role,
      location: user.location,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.log('UPDATE USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.updatePassword = async (req, res) => {
  const { oldPassword, password, newPasswordConfirm, userAuth } = req.body;

  try {
    //Validate User
    const profileOwner = req.params.userId === userAuth;
    if (!profileOwner)
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    // validate fields
    if (!oldPassword || !password || !newPasswordConfirm)
      return res.status(400).send('All fields are required');

    //check password length and if it contains a number
    let hasNumber = /\d/;
    if (password.length < 6)
      return res
        .status(400)
        .send('Pasword too short, must be 6 characters and above');
    if (!hasNumber.test(password))
      return res.status(400).send('Pasword must contain a number');

    //validate new password fields
    if (newPasswordConfirm !== password)
      return res.status(400).send('New password fields does not match.');

    // get user
    const user = await User.findById(req.params.userId);
    console.log(user);
    if (!user) {
      return res.status(400).send('User not found');
    }

    // validate old password
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).send('Please enter correct old password');
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).send('New password must not be same as old');
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // update user's password
    user.password = hashedPassword;
    const updatedUser = await user.save();

    return res.json({ user: updatedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};

exports.followUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (user) {
      user.followers.push(req.user._id);
      user.save();
      res.json(user);
    }
    let actionUser = await User.findById(req.user._id);
    if (actionUser) {
      actionUser.following.push(req.params.userId);
      actionUser.save();
    }
    await newFollowerNotification(actionUser._id, user._id);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};
exports.unfollowUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    const userId = user.followers.indexOf(req.user._id);
    user.followers.splice(userId, 1);
    user.save();
    res.json(user);

    let actionUser = await User.findById(req.user._id);
    if (actionUser) {
      const actionUserId = actionUser.following.indexOf(req.params.userId);
      actionUser.following.splice(actionUserId, 1);
      actionUser.save();
    }
    await removeFollowerNotification(
      actionUser._id.toString(),
      user._id.toString()
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};

exports.userProducts = async (req, res) => {
  try {
    const products = await Product.find({
      author: req.params.userId,
      status: req.body.filter,
    })
      .sort({ createdAt: '-1' })
      .populate('author category location')
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};
exports.userActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({
      author: req.params.userId,
      status: 'active',
    })
      .sort({ createdAt: '-1' })
      .populate('author category location')
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};
exports.userPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      author: req.params.userId,
      status: 'pending',
    })
      .sort({ createdAt: '-1' })
      .populate('author category location')
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};
exports.userClosedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      author: req.params.userId,
      status: 'closed',
    })
      .sort({ createdAt: '-1' })
      .populate('author category location')
      .exec();
    res.json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};
exports.favouriteProducts = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .sort({ createdAt: '-1' })
      .populate([
        { path: 'favourites', populate: { path: 'author' } },
        { path: 'favourites', populate: { path: 'category' } },
        { path: 'favourites', populate: { path: 'location' } },
      ])
      .exec();
    res.json(user.favourites);
  } catch (err) {
    console.log(err);
    return res.status(500).send('Something went wrong. Try again');
  }
};
