const express = require("express");

const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");
const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const requiredAddressFields = [
  "fullName",
  "phone",
  "pincode",
  "state",
  "city",
  "houseNo",
  "roadName",
];

const hasRequiredAddress = (
  address = {}
) =>
  requiredAddressFields.every(
    (field) =>
      String(address[field] ?? "").trim()
  );

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    

    const {
      userId,
      items,
      totalAmount,
      paymentId,
      shippingAddress,
    } = req.body;

    if (!hasRequiredAddress(shippingAddress)) {
      return res.status(400).json({
        message:
          "Warning: fill all the required details.",
      });
    }

    for (const item of items) {
      const productId =
        item.productId || item._id;

      const quantity =
        item.quantity || 1;

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          message:
            `${product.name} has only ${product.stock} left`,
        });
      }
    }

    for (const item of items) {
      const productId =
        item.productId || item._id;

      const quantity =
        item.quantity || 1;

      await Product.findByIdAndUpdate(
        productId,
        {
          $inc: {
            stock: -quantity,
          },
        }
      );
    }

    const newOrder = new Order({
      userId,
      items: items.map((item) => ({
        productId:
          item.productId || item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        description:
          item.description,
        quantity:
          item.quantity || 1,
      })),
      totalAmount,
      paymentId,
      shippingAddress: {
        ...shippingAddress,
        phone: Number(
          shippingAddress.phone
        ),
        pincode: Number(
          shippingAddress.pincode
        ),
      },
    });

    const savedOrder =
      await newOrder.save();

    res.status(201).json(
      savedOrder
    );
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Order save failed",
    });
  }
});


// GET ORDERS
router.get("/", async (req, res) => {
  try {
    const orders =
      await Order.find().sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message:
        "Failed to fetch orders",
    });
  }
});

// CUSTOMER ORDER ACTION
router.put(
  "/:id/action",
  async (req, res) => {
    try {
      const {
        action,
        userId,
      } = req.body;

      const order =
        await Order.findById(
          req.params.id
        );

      if (!order) {
        return res.status(404).json({
          message:
            "Order not found",
        });
      }

      if (order.userId !== userId) {
        return res.status(403).json({
          message:
            "You can update only your own order",
        });
      }

      const currentStatus =
        order.status || "Pending";

      const canCancel = [
        "Pending",
        "Packed",
      ].includes(currentStatus);

      const canExchange = [
        "Pending",
        "Packed",
        "Shipped",
        "Delivered",
      ].includes(currentStatus);

      if (action === "cancel") {
        if (!canCancel) {
          return res.status(400).json({
            message:
              "This order cannot be cancelled now",
          });
        }

        order.status = "Cancelled";

        for (const item of order.items) {
          if (item.productId) {
            await Product.findByIdAndUpdate(
              item.productId,
              {
                $inc: {
                  stock:
                    item.quantity || 1,
                },
              }
            );
          }
        }
      } else if (action === "exchange") {
        if (!canExchange) {
          return res.status(400).json({
            message:
              "This order cannot be exchanged now",
          });
        }

        order.status =
          "Exchange Requested";
      } else {
        return res.status(400).json({
          message:
            "Invalid order action",
        });
      }

      const updatedOrder =
        await order.save();

      res.json(updatedOrder);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to update order",
      });
    }
  }
);

// UPDATE ORDER STATUS
router.put(
  "/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const updatedOrder =
        await Order.findByIdAndUpdate(
          req.params.id,
          {
            status:
              req.body.status,
          },
          { new: true }
        );

      res.json(updatedOrder);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Failed to update order status",
      });
    }
  }
);

module.exports = router;
