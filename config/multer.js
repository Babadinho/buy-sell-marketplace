const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(
        null,
        new Date().toISOString().replace(/[\/\\:]/g, '_') + file.originalname
      );
    },
  }),
  limits: {
    fileSize: 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
