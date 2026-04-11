const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    products: Array,
    total: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);