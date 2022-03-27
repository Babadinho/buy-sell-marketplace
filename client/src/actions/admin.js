import axios from 'axios';

export const getUsers = async () =>
  await axios.get(`${process.env.REACT_APP_API}/admin/users`);

export const getUser = async (userId) =>
  await axios.get(`${process.env.REACT_APP_API}/admin/user/edit/${userId}`);

export const editUser = async (userId, user, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/user/update/${userId}`,
    user,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteUser = async (userId, admin, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/admin/user/delete/${userId}`,
    admin,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
export const banUser = async (userId, admin, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/admin/user/ban/${userId}`,
    admin,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
export const unBanUser = async (userId, admin, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/admin/user/unban/${userId}`,
    admin,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const addCategory = async (category) =>
  await axios.post(`${process.env.REACT_APP_API}/admin/add-category`, category);

export const allCategories = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/admin/categories`);
};

export const getCategory = async (categoryId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/admin/category/edit/${categoryId}`
  );

export const editCategory = async (categoryId, category, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/category/update/${categoryId}`,
    category,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
export const deleteCategory = async (categoryId, token) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/admin/category/delete/${categoryId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const addLocation = async (location) =>
  await axios.post(`${process.env.REACT_APP_API}/admin/add-location`, location);

export const allLocations = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/locations`);
};

export const getLocation = async (locationId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/admin/location/edit/${locationId}`
  );

export const editLocation = async (locationId, location, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/admin/location/update/${locationId}`,
    location,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const deleteLocation = async (locationId, token) =>
  await axios.delete(
    `${process.env.REACT_APP_API}/admin/location/delete/${locationId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const productStatus = async () =>
  await axios.get(`${process.env.REACT_APP_API}/product-status`);

export const updateproductStatus = async (productId, status, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/product/update-status`,
    productId,
    status,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const pendingProducts = async () =>
  await axios.get(`${process.env.REACT_APP_API}/admin/pending-products`);

export const activeProducts = async () =>
  await axios.get(`${process.env.REACT_APP_API}/admin/active-products`);

export const approveReport = async (productId, action, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/admin/approve-report/${productId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
export const rejectReport = async (productId, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/admin/reject-report/${productId}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
