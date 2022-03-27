const express = require('express');
const upload = require('../config/multer3');

const router = express.Router();

// middlewares
const { requireSignin } = require('../middlewares');

//controllers
const {
  addProduct,
  allProducts,
  singleProduct,
  updateProduct,
  closeProduct,
  deleteProductImage,
  addFavourite,
  removeFavourite,
  getByCategory,
  getByFilter,
  allCategories,
  allLocations,
  searchResults,
  favouriteCount,
  reportProduct,
  getReportedProducts,
  relatedProducts,
} = require('../controllers/product');

//routes
router.post(
  '/add-product/:userId',
  requireSignin,
  upload.array('images', 12),
  addProduct
);
router.get('/products', allProducts);
router.get('/product/:productId', singleProduct);
router.get('/product/favourite-count/:productId', favouriteCount);
router.put(
  '/update-product/:productId',
  upload.array('images', 12),
  requireSignin,
  updateProduct
);
router.get('/category/:categoryId', getByCategory);
router.put('/close-product/:productId', closeProduct);
router.post('/delete-image/:productId', deleteProductImage);
router.put('/add-favourite/:productId', addFavourite);
router.put('/remove-favourite/:productId', removeFavourite);
router.post('/products/filter', getByFilter);
router.get('/categories', allCategories);
router.get('/locations', allLocations);
router.post('/search-results', searchResults);
router.post('/report-product/:productId', reportProduct);
router.get('/reported-products', getReportedProducts);
router.get('/related-products/:categoryId', relatedProducts);

module.exports = router;
