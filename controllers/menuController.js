import menuItemModel from "../models/menuItemModel.js";
import { v2 as cloudinary } from "cloudinary";

// ===============================
// ADD MENU ITEM (ADMIN)
// ===============================
export const addMenuItem = async (req, res) => {
  try {
    let imageUrl = "";

    // ✅ Proper Cloudinary upload
    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "restaurant-menu",
      });
      imageUrl = uploaded.secure_url;
    }

    const item = await menuItemModel.create({
      ...req.body,
      image: imageUrl,
    });

    return res.status(201).json({
      success: true,
      menu: item,
    });
  } catch (err) {
    console.error("Add Menu Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET ALL MENU (PUBLIC)
// GET /api/menu/all
// ===============================
export const getAllMenu = async (req, res) => {
  try {
    const menu = await menuItemModel.find({});
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

// ===============================
// LIST MENU (ALIAS / OPTIONAL)
// GET /api/menu/list
// ===============================
export const listMenuItems = async (req, res) => {
  try {
    const items = await menuItemModel.find({});
    return res.status(200).json({
      success: true,
      menu: items,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE MENU ITEM (ADMIN)
// ===============================
export const updateMenuItem = async (req, res) => {
  try {
    let updateData = { ...req.body };

    if (req.file) {
      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "restaurant-menu",
      });
      updateData.image = uploaded.secure_url;
    }

    const updated = await menuItemModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      menu: updated,
    });
  } catch (err) {
    console.error("Update Menu Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// DELETE MENU ITEM (ADMIN)
// ===============================
export const deleteMenuItem = async (req, res) => {
  try {
    await menuItemModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Menu item deleted",
    });
  } catch (err) {
    console.error("Delete Menu Error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
