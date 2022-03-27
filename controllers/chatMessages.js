const Chat = require('../models/Chat');
const User = require('../models/User');

const loadMessages = async (userId, messagesWith) => {
  try {
    const user = await Chat.findOne({ user: userId }).populate(
      'chats.messagesWith'
    );

    const chat = user.chats.find(
      (chat) => chat.messagesWith._id.toString() === messagesWith
    );

    if (!chat) {
      return { error: 'No chat found' };
    }

    chat.messagesWith.password = undefined;
    return { chat };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const sendMsg = async (userId, msgSendToUserId, msg) => {
  try {
    // LOGGED IN USER (SENDER)
    const user = await Chat.findOne({ user: userId });

    // RECEIVER
    const msgSendToUser = await Chat.findOne({ user: msgSendToUserId });

    const newMsg = {
      sender: userId,
      receiver: msgSendToUserId,
      msg,
      date: Date.now(),
    };

    const previousChat = user.chats.find(
      (chat) => chat.messagesWith.toString() === msgSendToUserId
    );

    if (previousChat) {
      previousChat.messages.push(newMsg);
      let index = user.chats.indexOf(previousChat);
      console.log(index);
      user.chats.unshift(user.chats.splice(index, 1)[0]);
      await user.save();
    } else {
      const newChat = { messagesWith: msgSendToUserId, messages: [newMsg] };
      user.chats.unshift(newChat);
      await user.save();
    }

    const previousChatForReceiver = msgSendToUser.chats.find(
      (chat) => chat.messagesWith.toString() === userId
    );

    if (previousChatForReceiver) {
      previousChatForReceiver.messages.push(newMsg);
      let index = msgSendToUser.chats.indexOf(previousChatForReceiver);
      console.log(index);
      msgSendToUser.chats.unshift(msgSendToUser.chats.splice(index, 1)[0]);
      await msgSendToUser.save();
    } else {
      const newChat = { messagesWith: userId, messages: [newMsg] };
      msgSendToUser.chats.unshift(newChat);
      await msgSendToUser.save();
    }

    return { newMsg };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

const setMsgToUnread = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (!user.unreadMessage || !user.unreadNotification) {
      user.unreadMessage = true;
      await user.save();
    }
    user.password = undefined;
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};
const markMessageRead = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);

    if (user.unreadMessage) {
      user.unreadMessage = false;
      await user.save();
    }
    user.password = undefined;
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const deleteMsg = async (userId, messagesWith, messageId) => {
  try {
    const user = await Chat.findOne({ user: userId });

    const chat = user.chats.find(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    if (!chat) return;

    const messageToDelete = chat.messages.find(
      (message) => message._id.toString() === messageId
    );

    if (!messageToDelete) return;

    if (messageToDelete.sender.toString() !== userId) {
      return;
    }

    const indexOf = chat.messages
      .map((message) => message._id.toString())
      .indexOf(messageToDelete._id.toString());

    await chat.messages.splice(indexOf, 1);

    await user.save();

    return { success: true };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loadMessages,
  sendMsg,
  setMsgToUnread,
  markMessageRead,
  deleteMsg,
};
