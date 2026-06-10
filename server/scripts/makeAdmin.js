require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
  console.log(
    "Usage: node scripts/makeAdmin.js your-email@example.com"
  );
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    const user =
      await User.findOneAndUpdate(
        { email },
        { isAdmin: true },
        { new: true }
      );

    if (!user) {
      console.log(
        `No user found with email: ${email}`
      );
      process.exit(1);
    }

    console.log(
      `${user.email} is now an admin.`
    );
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

makeAdmin();
