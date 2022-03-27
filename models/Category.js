const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('category', CategorySchema);
