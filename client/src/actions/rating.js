import axios from 'axios';

export const rateUser = async (userId, rating) =>
  await axios.post(`${process.env.REACT_APP_API}/rate/user/${userId}`, rating);

export const deleteRating = async (ratingId, userId) =>
  await axios.post(
    `${process.env.REACT_APP_API}/delete-rating/${ratingId}`,
    userId
  );
