const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReportSchema = new Schema(
  {
    reason: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('report', ReportSchema);
