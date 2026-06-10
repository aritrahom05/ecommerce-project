const express = require("express");
const router = express.Router();

const Address = require("../models/Address");
const { protect } = require("../middleware/authMiddleware");

const requiredFields = [
  "fullName",
  "phone",
  "pincode",
  "state",
  "city",
  "addressLine1",
  "addressLine2",
];

const validateAddress = (address) =>
  requiredFields.every((field) =>
    String(address[field] ?? "").trim()
  );

router.post("/", protect, async (req, res) => {
  if (!validateAddress(req.body)) {
    return res.status(400).json({
      message:
        "Warning: fill all the required details.",
    });
  }

  const address = await Address.create({
    ...req.body,
    phone: Number(req.body.phone),
    pincode: Number(req.body.pincode),
    user: req.user._id,
  });

  res.json(address);
});

router.get("/", protect, async (req, res) => {
  const addresses = await Address.find({
    user: req.user._id,
  });

  res.json(addresses);
});

router.get("/:id", protect, async (req, res) => {
  const address = await Address.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!address) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  res.json(address);
});

router.put("/:id", protect, async (req, res) => {
  if (!validateAddress(req.body)) {
    return res.status(400).json({
      message:
        "Warning: fill all the required details.",
    });
  }

  const address =
    await Address.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        ...req.body,
        phone: Number(req.body.phone),
        pincode: Number(req.body.pincode),
      },
      { new: true }
    );

  if (!address) {
    return res.status(404).json({
      message: "Address not found",
    });
  }

  res.json(address);
});

router.delete("/:id", protect, async (req, res) => {
  await Address.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  res.json({
    success: true,
  });
});

module.exports = router;
