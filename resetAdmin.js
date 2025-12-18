// backend/resetAdmin.js
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

async function run() {
  try {
    console.log("MONGO_URI =", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;

    const hashed = bcrypt.hashSync(plainPassword, 10);

    let admin = await User.findOne({ email });

    if (!admin) {
      admin = await User.create({
        name: "Admin",
        email,
        password: hashed,
        role: "admin",
      });
      console.log("Admin created:", admin);
    } else {
      admin.password = hashed;
      admin.role = "admin";
      await admin.save();
      console.log("Admin updated:", admin);
    }

    console.log("\n==============================");
    console.log("ADMIN EMAIL:", email);
    console.log("ADMIN PASSWORD:", plainPassword);
    console.log("==============================\n");

    await mongoose.disconnect();
    console.log("DONE.");
  } catch (err) {
    console.error(err);
  }
}

run();
