import menuItemModel from "../models/menuItemModel.js";
import { v2 as cloudinary } from "cloudinary";

// Add menu item
export const addMenuItem = async (req, res) => {
  try {
    let imageUrl = "";

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload_stream({
        folder: "restaurant-menu"
      });
    }

    const item = await menuItemModel.create({
      ...req.body,
      image: imageUrl
    });

    res.json({ success: true, data: item });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// List items
export const listMenuItems = async (req, res) => {
  try {
    const items = await menuItemModel.find({});
    res.json({ success: true, menu: items }); // 🔥 CHANGE HERE
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Update item
export const updateMenuItem = async (req, res) => {
  try {
    let update = { ...req.body };

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload_stream({
        folder: "restaurant-menu"
      });
    }

    const updated = await menuItemModel.findByIdAndUpdate(req.params.id, update, { new: true });

    res.json({ success: true, data: updated });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Delete item
export const deleteMenuItem = async (req, res) => {
  try {
    await menuItemModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};



export const getAllMenu = async (req, res) => {
  try {
    const menu = await menuItemModel.find({}); // ✅ FIXED
    return res.status(200).json({
      success: true,
      menu,
    });
  } catch (err) {
    console.error("Menu Fetch Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error fetching menu",
    });
  }
};