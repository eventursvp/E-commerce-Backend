const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TermsAndCondition = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    addedBy: {
      type: Schema.ObjectId,
      ref: "Admin",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    productId: {
      type: Schema.ObjectId,
      ref: "Product",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "TermsAndConditions",
  TermsAndCondition,
  "TermsAndCondition"
);
