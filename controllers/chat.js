const Chat = require('../models/Chat');

exports.userChat = async (req, res) => {
  try {
    const user = await Chat.findOne({ user: req.params.userId }).populate(
      'chats.messagesWith'
    );

    let chatsToBeSent = [];

    if (user.chats.length > 0) {
      chatsToBeSent = await user.chats.map((chat) => ({
        messagesWith: chat.messagesWith._id,
        name: chat.messagesWith.name,
        profilePicUrl: chat.messagesWith.photo,
        lastMessage: chat.messages[chat.messages.length - 1].msg,
        date: chat.messages[chat.messages.length - 1].date,
      }));
    }

    return res.json(chatsToBeSent);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const { messagesWith } = req.params;
    const { userId } = req.body;

    const user = await Chat.findOne({ user: userId });

    const chatToDelete = user.chats.find(
      (chat) => chat.messagesWith.toString() === messagesWith
    );

    if (!chatToDelete) {
      return res.status(404).send('Chat not found');
    }

    const indexOf = user.chats
      .map((chat) => chat.messagesWith.toString())
      .indexOf(messagesWith);

    user.chats.splice(indexOf, 1);

    await user.save();

    return res.status(200).send('Chat deleted');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
};
