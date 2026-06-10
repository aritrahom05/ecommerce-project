const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "secretkey";

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json("User not found");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json("Invalid credentials");

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post(
  "/check-email",
  async (req, res) => {
    try {
      const user =
        await User.findOne({
          email: req.body.email,
        });

      if (!user) {
        return res.json({
          success: false,
        });
      }

      res.json({
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
      });
    }
  }
);


router.post(
  "/reset-password",
  async (req, res) => {

    const hashedPassword =
      await bcrypt.hash(
        req.body.password,
        10
      );

    await User.findOneAndUpdate(
      {
        email:
          req.body.email,
      },
      {
        password:
          hashedPassword,
      }
    );

    res.json({
      success: true,
    });
  }
);

module.exports = router;