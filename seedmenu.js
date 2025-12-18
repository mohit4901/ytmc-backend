import mongoose from "mongoose";
import MenuItem from "./models/menuItemModel.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function seedMenu() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected!");

    const raw = fs.readFileSync("./menu.json", "utf-8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error("menu.json must be an array");
    }

    await MenuItem.deleteMany({});
    console.log("Old menu cleared!");

    await MenuItem.insertMany(data);
    console.log(`Inserted ${data.length} menu items successfully!`);

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed ❌", err);
    process.exit(1);
  }
}

seedMenu();
