const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: String,

    products: [
      {
        name: String,
        price: Number,
        description: String,
        image: String,
      },
    ],

    total: Number,

    paymentId: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Order",
  orderSchema
);