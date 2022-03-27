import axios from 'axios';

export const addProduct = async (userId, product, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/add-product/${userId}`,
    product,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const allProducts = async () =>
  await axios.get(`${process.env.REACT_APP_API}/products`);

export const singleProduct = async (productId) =>
  await axios.get(`${process.env.REACT_APP_API}/product/${productId}`);

export const relatedProducts = async (categoryId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/related-products/${categoryId}`
  );

export const favouriteCount = async (productId) =>
  await axios.get(
    `${process.env.REACT_APP_API}/product/favourite-count/${productId}`
  );

export const getByCategory = async (categoryId) =>
  await axios.get(`${process.env.REACT_APP_API}/category/${categoryId}`);

export const updateProduct = async (productId, product, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/update-product/${productId}`,
    product,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const closeProduct = async (productId, token) =>
  await axios.put(`${process.env.REACT_APP_API}/close-product/${productId}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteProductImage = async (productId, imageId, imageUrl, token) =>
  await axios.post(
    `${process.env.REACT_APP_API}/delete-image/${productId}`,
    imageId,
    imageUrl,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const addFavourite = async (productId, user, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/add-favourite/${productId}`,
    user,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
export const removeFavourite = async (productId, user, token) =>
  await axios.put(
    `${process.env.REACT_APP_API}/remove-favourite/${productId}`,
    user,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const getFilteredProducts = async (filters = {}, sortBy) => {
  const data = {
    filters,
    sortBy,
  };
  return await axios.post(`${process.env.REACT_APP_API}/products/filter`, data);
};

export const allCategories = async () =>
  await axios.get(`${process.env.REACT_APP_API}/categories`);

export const allLocations = async () =>
  await axios.get(`${process.env.REACT_APP_API}/locations`);

export const searchResults = async (query) =>
  await axios.post(`${process.env.REACT_APP_API}/search-results`, query);

export const reportProduct = async (productId, report) =>
  await axios.post(
    `${process.env.REACT_APP_API}/report-product/${productId}`,
    report
  );

export const getReportedProducts = async () =>
  await axios.get(`${process.env.REACT_APP_API}/reported-products`);
