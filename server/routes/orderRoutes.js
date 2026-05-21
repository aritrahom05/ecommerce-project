const express = require("express");

const router = express.Router();

const Order = require("../models/Order");


// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    

    const {
      userId,
      items,
      totalAmount,
      paymentId,
    } = req.body;

    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      paymentId,
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

module.exports = router;