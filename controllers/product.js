const Product = require('../models/Product');
const User = require('../models/User');
const Category = require('../models/Category');
const Location = require('../models/Location');
const Report = require('../models/Report');
const cloudinary = require('../config/cloudinary').v2;
const {
  setNotificationToUnread,
  newFavoriteNotification,
  removeFavoriteNotification,
} = require('./notification');

exports.addProduct = async (req, res) => {
  try {
    const { name, category, location, description, condition, price, images } =
      req.body;
    //validation
    if (!name || !category || !location || !description || !price)
      return res.status(400).send('Fields marked * are required');

    //validate and upload images
    if (!images) return res.status(400).send('Please upload some images');
    if (images.length < 2 || images.length > 1000)
      return res.status(400).send('Please upload atleast 2 images');

    const files = [];
    const file_ids = [];
    for (let i = 0; i < images.length; i++) {
      const imageUrl = await cloudinary.uploader.upload(images[i], {
        folder: 'buynsell',
      });
      files.push(imageUrl.url);
      file_ids.push(imageUrl.public_id);
    }

    const product = new Product({
      name,
      category,
      location,
      description,
      condition,
      price,
      images: files,
      image_ids: file_ids,
      author: req.params.userId,
    });
    const newProduct = await product.save();
    const user = await User.findById(req.params.userId).exec();
    user.products.push(product._id);
    user.save();
    return res.json({ product: newProduct });
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) message.error(err.response.data, 4);
  }
};

exports.allProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('author category location');
    return res.json(products);
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) message.error(err.response.data, 4);
  }
};

exports.singleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate(
      'category location author reports'
    );
    return res.json(product);
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) message.error(err.response.data, 4);
  }
};

exports.relatedProducts = async (req, res) => {
  try {
    const product = await Product.find({
      category: req.params.categoryId,
    }).populate('category location author reports');
    return res.json(product);
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) message.error(err.response.data, 4);
  }
};

exports.favouriteCount = async (req, res) => {
  try {
    const users = await User.find({ favourites: req.params.productId }).exec();
    return res.json(users.length);
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) message.error(err.response.data, 4);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      location,
      description,
      condition,
      price,
      images,
      author,
      userAuth,
    } = req.body;

    //Validate User
    const productOwner = author === userAuth;
    if (!productOwner)
      return res
        .status(400)
        .send('You are not authorized to perform this action');

    // validation;
    if (!name || !category || !location || !description || !price)
      return res.status(400).send('Fields marked * are required');

    //validate and upload images
    if (!images) return res.status(400).send('Please upload some images');
    if (images.length < 2 || images.length > 1000)
      return res.status(400).send('Please upload atleast 2 images');

    const getIds = await Product.findById(req.params.productId);
    const file_ids = getIds.image_ids;
    const files = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i].substring(11, 21) === 'cloudinary') {
        files.push(images[i]);
      }
      if (images[i].substring(11, 21) !== 'cloudinary') {
        const imageUrl = await cloudinary.uploader.upload(images[i], {
          folder: 'buynsell',
        });
        files.push(imageUrl.url);
        file_ids.push(imageUrl.public_id);
      }
    }

    const productUpdate = {
      name,
      category,
      location,
      description,
      condition,
      price,
      images: files,
      image_ids: file_ids,
      status: 'pending',
    };
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      { $set: productUpdate },
      { new: true, useFindAndModify: false }
    );
    return res.json(product);
  } catch (err) {
    console.log(err);
    if (err.response.status === 400) message.error(err.response.data, 4);
  }
};

exports.closeProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).exec();
    product.status = 'closed';
    product.save();
    return res.json(product);
  } catch (err) {
    console.log('CLOSE PRODUCT FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.deleteProductImage = async (req, res) => {
  try {
    const { imageId, imageUrl } = req.body;
    const product = await Product.findById(req.params.productId).exec();
    if (product) {
      const deleteUlr = product.images.indexOf(imageUrl);
      product.images.splice(deleteUlr, 1);
      const deleteId = product.image_ids.indexOf(imageId);
      product.image_ids.splice(deleteId, 1);
      product.save();
      res.json(product);
    }
    cloudinary.uploader.destroy(imageId, function (error, result) {
      console.log(result, error);
    });
  } catch (err) {
    console.log('IMAGE DELETE FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.addFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.body.user._id).exec();
    user.favourites.push(req.params.productId);
    await user.save();

    const product = await Product.findById(req.params.productId);
    console.log(product.author);

    if (product.author.toString() !== req.body.user._id) {
      await newFavoriteNotification(
        req.body.user._id,
        req.params.productId,
        product.author.toString()
      );
    }
    user.password = undefined;
    return res.json(user);
  } catch (err) {
    console.log('ADD FAVOURITE FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
exports.removeFavourite = async (req, res) => {
  try {
    const user = await User.findById(req.body.user._id).exec();
    if (user) {
      const removeFav = user.favourites.indexOf(req.params.productId);
      user.favourites.splice(removeFav, 1);
      user.save();

      const product = await Product.findById(req.params.productId);

      if (product.author.toString() !== req.body.user._id) {
        await removeFavoriteNotification(
          req.body.user._id,
          req.params.productId,
          product.author.toString()
        );
      }

      user.password = undefined;
      return res.json(user);
    }
  } catch (err) {
    console.log('REMOVE FAVOURITE FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    }).populate('author category location');
    return res.json(products);
  } catch (err) {
    console.log('GET CATEGORY FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
exports.getByFilter = async (req, res) => {
  try {
    console.log(req.body);
    let findArgs = {};

    for (let key in req.body.filters) {
      if (req.body.filters[key].length > 0) {
        if (key === 'price') {
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1],
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }

    const products = await Product.find(findArgs)
      .sort({ createdAt: req.body.sortBy })
      .populate('author category location')
      .exec();
    res.json(products);
  } catch (err) {
    console.log('GET BY FILTER FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.allCategories = async (req, res) => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'category',
        as: 'products',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        productCount: { $size: '$products' },
      },
    },
  ]).exec();

  res.json(categories);
};
exports.allLocations = async (req, res) => {
  const locations = await Location.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: 'location',
        as: 'products',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        productCount: { $size: '$products' },
      },
    },
  ]).exec();

  res.json(locations);
};

exports.searchResults = async (req, res) => {
  let query = {};

  for (let key in req.body) {
    if (req.body[key].length > 0) {
      if (key === 'name') {
        query[key] = new RegExp(req.body.name, 'i');
      } else if (key === 'price') {
        query[key] = {
          $gte: req.body[key][0],
          $lte: req.body[key][1],
        };
      } else {
        query[key] = req.body[key];
      }
    }
  }

  let result = await Product.find(query)
    .sort({ createdAt: '-1' })
    .populate('author category location');
  res.json(result);
};

exports.reportProduct = async (req, res) => {
  const { reason, details, product, author } = req.body;
  try {
    const report = new Report({
      reason,
      details,
      product,
      author,
    });

    const newReport = await report.save();
    const productReport = await Product.findById(product);
    productReport.reports.push(newReport._id);
    productReport.save();
    res.json(newReport);
  } catch (err) {
    console.log('REPORT PRODUCT FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};

exports.getReportedProducts = async (req, res) => {
  try {
    const reported = await Report.find().populate('author product').exec();
    res.json(reported);
  } catch (err) {
    console.log('GET PRODUCTED PRODUCTS FAILED', err);
    return res.status(400).send('Error. Try again');
  }
};
