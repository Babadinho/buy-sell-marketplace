import axios from 'axios';

export const getChats = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/user/messages/${userId}`);

export const deleteChat = async (messagesWith, userId, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/message/${messagesWith}`,
    userId,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
