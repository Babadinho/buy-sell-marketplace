import axios from 'axios';

export const register = async (user) =>
  await axios.post(`${process.env.REACT_APP_API}/register`, user);

export const login = async (user) =>
  await axios.post(`${process.env.REACT_APP_API}/login`, user);

export const authenticate = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('buynsell', JSON.stringify(data));
  }
};

export const isAuthenticated = () => {
  if (typeof window == 'undefined') {
    return false;
  }
  if (localStorage.getItem('buynsell')) {
    return JSON.parse(localStorage.getItem('buynsell'));
  } else {
    return false;
  }
};
