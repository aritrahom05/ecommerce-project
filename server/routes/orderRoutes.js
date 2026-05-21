const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// CREATE ORDER
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      products,
      total,
      paymentId,
    } = req.body;

    const order = new Order({
      userId,
      products,
      total,
      paymentId,
    });

    const savedOrder = await order.save();

    res.json(savedOrder);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();

    res.json(orders);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;