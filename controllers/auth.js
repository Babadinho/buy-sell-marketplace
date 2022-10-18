const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Notification = require('../models/Notification');
const Chat = require('../models/Chat');

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, username, phone, password } = req.body;
    //validation
    if (!name || !email || !username || !phone || !password)
      return res.status(400).send('All fields are required');

    //validate password
    let hasNumber = /\d/;
    if (password.length < 6)
      return res
        .status(400)
        .send('Pasword too short, must be 6 characters and above');
    if (!hasNumber.test(password))
      return res.status(400).send('Pasword must contain a number');

    //validate phone
    let phoneno = /^\d{11}$/;
    if (!phone.match(phoneno))
      return res.status(400).send('Phone number must be 11 characters long');

    //check if user email already exists
    let userExist = await User.findOne({ email: email }).exec();
    if (userExist) return res.status(400).send('Email already exists');
    //check if username already exists
    let userNameExist = await User.findOne({ username: username }).exec();
    if (userNameExist) return res.status(400).send('Username already taken');
    //register user
    const user = new User(req.body);

    //hash password and save user
    bcrypt.genSalt(12, function (err, salt) {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        user.save();
        new Notification({
          user: user._id,
          notifications: [],
          currentNotificationCount: 0,
        }).save();
        new Chat({
          user: user._id,
          chats: [],
        }).save();
        return res.json({ ok: true });
      });
    });
  } catch (err) {
    console.log('CREATE USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  //validation
  if (!email || !password)
    return res.status(400).send('All fields are required');

  try {
    let user = await User.findOne({ email }).exec();
    if (!user)
      return res.status(400).send('User with that email does not exist');

    if (user.role === 'banned')
      return res
        .status(400)
        .send('You have been banned for breaking site rules!');

    //match password
    bcrypt.compare(password, user.password, function (err, match) {
      if (!match || err) {
        return res.status(400).send('Password is incorrect');
      }
      console.log('password match', match);
      //Generate jwt signed token and send as reponse to client
      let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      const chatModel = Chat.findOne(
        { user: user._id },
        function (err, userChat) {
          if (err) {
            console.log(err);
          }
          if (userChat) {
            return console.log(userChat);
          }
          if (!userChat) {
            return new Chat({
              user: user._id,
              chats: [],
            }).save();
          }
        }
      );

      res.json({
        token,
        user: {
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
        },
      });
    });
  } catch (err) {
    console.log('Login ERROR', err);
    res.status(400).send('Login failed. try again');
  }
};
