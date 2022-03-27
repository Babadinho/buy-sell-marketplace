const express = require('express');

const router = express.Router();

const { userChat, deleteChat } = require('../controllers/chat');

//controllers
router.get('/user/messages/:userId', userChat);
router.post('/message/:messagesWith', deleteChat);

module.exports = router;
