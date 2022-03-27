import axios from 'axios';

export const viewUser = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/user/${userId}`);

export const viewUser2 = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/user2/${userId}`);

export const reduxUser = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/redux-user/${userId}`);

export const getUser = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/user/edit/${userId}`);

export const updateProfile = async (userId, user, token) =>
  await axios.put(`${process.env.REACT_APP_API}/user/update/${userId}`, user, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export const updatePassword = async (userId, user, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/user/password/${userId}`,
    user,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
// update user localStorage
export const updateUser = (user) => {
  if (typeof window !== 'undefined') {
    if (localStorage.getItem('buynsell')) {
      let auth = JSON.parse(localStorage.getItem('buynsell'));
      auth.user = user;
      localStorage.setItem('buynsell', JSON.stringify(auth));
    }
  }
};

export const followUser = async (userId, user, token) =>
  await axios.put(`${process.env.REACT_APP_API}/follow/${userId}`, user, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
export const unfollowUser = async (userId, user, token) =>
  await axios.put(`${process.env.REACT_APP_API}/unfollow/${userId}`, user, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export const getUserProducts = async (userId, filter) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/products/${userId}`,
    filter
  );

export const userActiveProducts = async (userId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/active-products/${userId}`
  );
export const userPendingProducts = async (userId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/pending-products/${userId}`
  );
export const userClosedProducts = async (userId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/closed-products/${userId}`
  );
export const userFavouriteProducts = async (userId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/user/favourite-products/${userId}`
  );
export const getUserNotifications = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/user/notifications/${userId}`);

export const markNotificationsRead = async (userId, notificationCount) =>
  await axios.post(
    `${process.env.REACT_APP_API}/user/read-notifications`,
    userId,
    notificationCount
  );
export const setMsgToUnread = async (userId) =>
  await axios.post(`${process.env.REACT_APP_API}/user/unread-message`, userId);
export const markMessageRead = async (userId) =>
  await axios.post(`${process.env.REACT_APP_API}/user/read-message`, userId);
