const Notification = require('../models/Notification');
const User = require('../models/User');
const Product = require('../models/Product');
const Rating = require('../models/Rating');

const setNotificationToRead = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user.unreadNotification) {
      user.unreadNotification = true;
    }
    await user.save();
    return;
  } catch (err) {
    console.log(err);
  }
};

const setNotificationToUnread = async (userId) => {
  try {
    const user = await User.findById(userId);
    const userNotification = await Notification.findOne({ user: userId });
    if (userNotification.notifications.length === 0) {
      user.unreadNotification = false;
    }
    await user.save();
    return;
  } catch (err) {
    console.log(err);
  }
};

const newFavoriteNotification = async (userId, prodcutId, userToNotifyId) => {
  try {
    const userToNotify = await Notification.findOne({ user: userToNotifyId });

    const newNotification = {
      type: 'newFavorite',
      status: 'unRead',
      user: userId,
      product: prodcutId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);
    await userToNotify.save();

    await setNotificationToRead(userToNotifyId);
    return;
  } catch (err) {
    console.log(err);
  }
};

const removeFavoriteNotification = async (
  userId,
  productId,
  userToNotifyId
) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const notifictionToRemove = user.notifications.find(
      (notification) =>
        notification.type === 'newFavorite' &&
        notification.product.toString() === productId &&
        notification.user.toString() === userId
    );

    const indexOf = user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notifictionToRemove._id.toString());

    if (user.currentNotificationCount !== 0) {
      user.currentNotificationCount--;
    }

    await user.notifications.splice(indexOf, 1);
    await user.save();
    await setNotificationToUnread(userToNotifyId);
    return;
  } catch (err) {
    console.log(err);
  }
};

const newRatingNotification = async (userId, ratingId, ratingAuthorId) => {
  try {
    const userToNotify = await Notification.findOne({ user: userId });

    const newNotification = {
      type: 'newRating',
      status: 'unRead',
      user: ratingAuthorId,
      ratedUser: userId,
      ratingId,
      date: Date.now(),
    };

    await userToNotify.notifications.unshift(newNotification);

    await userToNotify.save();

    await setNotificationToRead(userId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeRatingNotification = async (userId, ratingId, ratingAuthorId) => {
  console.log(userId, ratingId, ratingAuthorId);
  try {
    const user = await Notification.findOne({ user: userId });

    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === 'newRating' &&
        notification.user.toString() === ratingAuthorId &&
        notification.ratedUser.toString() === userId &&
        notification.ratingId.toString() === ratingId
    );

    const indexOf = await user.notifications
      .map((notification) => notification._id)
      .indexOf(notificationToRemove._id);

    await user.notifications.splice(indexOf, 1);
    if (user.currentNotificationCount !== 0) {
      user.currentNotificationCount--;
    }
    await user.save();
    await setNotificationToUnread(userToNotifyId);
  } catch (error) {
    console.error(error);
  }
};

const newFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const newNotification = {
      type: 'newFollower',
      status: 'unRead',
      user: userId,
      date: Date.now(),
    };

    await user.notifications.unshift(newNotification);

    await user.save();

    await setNotificationToRead(userToNotifyId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeFollowerNotification = async (userId, userToNotifyId) => {
  try {
    const user = await Notification.findOne({ user: userToNotifyId });

    const notificationToRemove = await user.notifications.find(
      (notification) =>
        notification.type === 'newFollower' &&
        notification.user.toString() === userId
    );

    const indexOf = await user.notifications
      .map((notification) => notification._id.toString())
      .indexOf(notificationToRemove._id.toString());

    await user.notifications.splice(indexOf, 1);

    if (user.currentNotificationCount !== 0) {
      user.currentNotificationCount--;
    }
    await user.save();
    await setNotificationToUnread(userToNotifyId);
  } catch (error) {
    console.error(error);
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const userNotifications = await Notification.findOne({
      user: req.params.userId,
    }).populate({
      path: 'notifications',
      populate: [
        {
          path: 'user',
          model: User,
        },
        {
          path: 'product',
          model: Product,
        },
        {
          path: 'ratingId',
          model: Rating,
        },
      ],
    });
    res.json(userNotifications);
  } catch (err) {
    console.log('GET NOTIFICATIONS FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

const markNotificationsRead = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findById(req.body.userId);

    if (user.unreadNotification) {
      user.unreadNotification = false;
      await user.save();
    }
    const userNotification = await Notification.findOne({
      user: req.body.userId,
    });
    if (userNotification) {
      userNotification.currentNotificationCount = req.body.notificationCount;
    }
    await userNotification.notifications.map((notification) => {
      if (notification.status === 'unRead') {
        notification.status = 'read';
      }
    });
    await userNotification.save();
    user.password = undefined;
    return res.json(user);
  } catch (err) {
    return res.status(400).send('Error. Try again');
  }
};

module.exports = {
  newFavoriteNotification,
  removeFavoriteNotification,
  newRatingNotification,
  removeRatingNotification,
  newFollowerNotification,
  removeFollowerNotification,
  getUserNotifications,
  markNotificationsRead,
};
