const Category = require('../models/Category');
const Location = require('../models/Location');
const User = require('../models/User');
const Product = require('../models/Product');
const Report = require('../models/Report');

exports.users = async (req, res) => {
  try {
    const users = await User.find().exec();
    return res.json(users);
  } catch (err) {
    return res.status(400).send('Something went wrong.');
  }
};

exports.editProfile = async (req, res) => {
  try {
    const { name, email, username, phone, location, adminAuth } = req.body;

    //Validate Admin
    if (adminAuth !== 'admin')
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    //validate fields
    if (!name || !email || !username || !phone)
      return res.status(400).send('All fields are required');

    //validate phone
    let phoneno = /^\d{11}$/;
    if (!phone.match(phoneno))
      return res.status(400).send('Phone number must be 11 characters long');
    //   const imageUrl = req.file ? req.file.path : undefined;

    let updatedUser = {
      name: name,
      email: email,
      username: username,
      phone: phone,
    };

    for (let prop in updatedUser)
      if (!updatedUser[prop]) delete updatedUser[prop];

    const user = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: updatedUser },
      { new: true, useFindAndModify: false }
    );
    res.json({
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
    });
  } catch (err) {
    console.log('UPDATE USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.deleteUser = async (req, res) => {
  const { adminRole } = req.body;
  console.log(req.body);
  try {
    //validate admin
    if (adminRole !== 'admin')
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    const user = await User.findById(req.params.userId);
    user.remove();
    return res.json(user);
  } catch (err) {
    console.log('DELETE USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
exports.banUser = async (req, res) => {
  const { adminRole } = req.body;
  try {
    //validate admin
    if (adminRole !== 'admin')
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    const user = await User.findById(req.params.userId);
    user.role = 'banned';
    user.save();
    return res.json(user);
  } catch (err) {
    console.log('BAN USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
exports.unbanUser = async (req, res) => {
  const { adminRole } = req.body;
  try {
    //validate admin
    if (adminRole !== 'admin')
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    const user = await User.findById(req.params.userId);
    user.role = 'user';
    user.save();
    return res.json(user);
  } catch (err) {
    console.log('UNBAN USER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    //validation
    if (!name) return res.status(400).send('Field cannot be empty');
    //check if category already exists
    let categoryExist = await Category.findOne({ name: name }).exec();
    if (categoryExist) return res.status(400).send('Category already exists');

    const newCategory = new Category(req.body);
    newCategory.save();
    console.log(newCategory);
    return res.json(newCategory);
  } catch (err) {
    return res.status(400).send('Something went wrong.');
  }
};

exports.allCategories = async (req, res) => {
  try {
    const categories = await Category.find().exec();
    return res.json(categories);
  } catch (err) {
    return res.status(400).send('Something went wrong.');
  }
};

exports.getCategory = async (req, res) => {
  let category = await Category.findById(req.params.categoryId).exec();
  res.json(category);
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    //validate field
    if (!name) return res.status(400).send('Field cannot be empty');

    const newCategory = await Category.findById(req.params.categoryId);
    newCategory.name = name;
    newCategory.save();
    return res.json(newCategory);
  } catch (err) {
    console.log('UPDATE CATEGORY FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    category.remove();
    return res.json(category);
  } catch (err) {
    console.log('DELETE CATEGORY FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.addLocation = async (req, res) => {
  try {
    const { name } = req.body;
    //validation
    if (!name) return res.status(400).send('Field cannot be empty');
    //check if location already exists
    let locationExist = await Location.findOne({ name: name }).exec();
    if (locationExist) return res.status(400).send('Location already exists');

    const newLocation = new Location(req.body);
    newLocation.save();
    console.log(newLocation);
    return res.json(newLocation);
  } catch (err) {
    return res.status(400).send('Something went wrong.');
  }
};

exports.allLocations = async (req, res) => {
  try {
    const locations = await Location.find().exec();
    return res.json(locations);
  } catch (err) {
    return res.status(400).send('Something went wrong.');
  }
};

exports.getLocation = async (req, res) => {
  let location = await Location.findById(req.params.locationId).exec();
  res.json(location);
};

exports.updateLocation = async (req, res) => {
  try {
    const { name } = req.body;

    //validate field
    if (!name) return res.status(400).send('Field cannot be empty');

    const newLocation = await Location.findById(req.params.locationId);
    newLocation.name = name;
    newLocation.save();
    return res.json(newLocation);
  } catch (err) {
    console.log('UPDATE LOCATION FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.locationId);
    location.remove();
    return res.json(location);
  } catch (err) {
    console.log('DELETE LOCATION FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.productStatus = (req, res) => {
  res.json(Product.schema.path('status').enumValues);
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { productId, status, token } = req.body;
    const product = await Product.findById({ _id: productId }).exec();
    product.status = status;
    if (product.status === 'active' && product.reports.length > 0) {
      product.reports = [];
    }
    product.save();
    return res.json(product);
  } catch (err) {
    console.log('UPDATE STATUS FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.pendingProducts = async (req, res) => {
  try {
    const product = await Product.find({ status: 'pending' })
      .populate('author category location')
      .exec();
    res.json(product);
  } catch (err) {
    console.log('GET PENDING PRODUCTS FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
exports.activeProducts = async (req, res) => {
  try {
    const product = await Product.find({ status: 'active' })
      .populate('author category location')
      .exec();
    res.json(product);
  } catch (err) {
    console.log('GET PENDING ACTIVE FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.approveReport = async (req, res) => {
  try {
    console.log(req.params.productId);
    const product = await Product.findById(req.params.productId).exec();
    product.status = 'closed';
    product.save();

    await Report.deleteMany({
      product: req.params.productId,
    }).exec();

    return res.json(product);
  } catch (err) {
    console.log('REPORT APPROVE FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
exports.rejectReport = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    product.reports = [];
    product.save();

    await Report.deleteMany({
      product: req.params.productId,
    }).exec();

    return res.json(product);
  } catch (err) {
    console.log('REPORT REJECT FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
