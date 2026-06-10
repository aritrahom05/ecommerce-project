const mongoose =
  require("mongoose");

const orderSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
      },

      items: [
        {
          name: String,

          price: Number,

          image: String,

          description:
            String,

          productId: String,

          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],

      totalAmount: {
        type: Number,
      },

      paymentId: {
        type: String,
      },

      shippingAddress: {
        fullName: String,
        phone: Number,
        alternatePhone: String,
        houseNo: String,
        roadName: String,
        landmark: String,
        city: String,
        state: String,
        pincode: Number,
        addressType: {
          type: String,
          default: "Home",
        },
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Packed",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Exchange Requested",
        ],
        default: "Pending",
      },
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Order",
    orderSchema
  );
