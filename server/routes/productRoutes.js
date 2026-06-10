const express = require("express");

const router = express.Router();

const Product = require("../models/Product");
const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const products =
      await Product.find();

    res.json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    res.json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE PRODUCT
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const product =
      new Product(req.body);

    const savedProduct =
      await product.save();

    res.json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE PRODUCT
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE PRODUCT
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
