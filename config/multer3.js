const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  ) {
    cb(null, true);
  } else {
    //reject file
    cb({ message: 'Unsupported file format' }, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 3072 * 3072 },
  fileFilter: fileFilter,
});

module.exports = upload;
