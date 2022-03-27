const express = require('express');
const upload = require('../config/multer2');

const router = express.Router();

//controllers
const {
  users,
  deleteUser,
  banUser,
  unbanUser,
  addCategory,
  allCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  addLocation,
  allLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  productStatus,
  updateProductStatus,
  editProfile,
  pendingProducts,
  activeProducts,
  approveReport,
  rejectReport,
} = require('../controllers/admin');
const { userProfile } = require('../controllers/user');
// middlewares
const { requireSignin } = require('../middlewares');

//routes
router.get('/admin/users', users);
router.get('/admin/user/edit/:userId', userProfile);
router.put(
  '/admin/user/update/:userId',
  requireSignin,
  upload.single('photo'),
  editProfile
);
router.post('/admin/user/delete/:userId', deleteUser);
router.post('/admin/user/ban/:userId', banUser);
router.post('/admin/user/unban/:userId', unbanUser);
router.get('/admin/categories', allCategories);
router.post('/admin/add-category', addCategory);
router.post('/admin/add-location', addLocation);
router.get('/locations', allLocations);
router.get('/admin/category/edit/:categoryId', getCategory);
router.put('/admin/category/update/:categoryId', updateCategory);
router.delete('/admin/category/delete/:categoryId', deleteCategory);
router.get('/admin/location/edit/:locationId', getLocation);
router.put('/admin/location/update/:locationId', updateLocation);
router.delete('/admin/location/delete/:locationId', deleteLocation);
router.get('/product-status', productStatus);
router.put('/product/update-status', updateProductStatus);
router.get('/admin/pending-products', pendingProducts);
router.get('/admin/active-products', activeProducts);
router.post('/admin/approve-report/:productId', approveReport);
router.post('/admin/reject-report/:productId', rejectReport);

module.exports = router;
