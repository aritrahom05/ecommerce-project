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
        },
      ],

      totalAmount: {
        type: Number,
      },

      paymentId: {
        type: String,
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