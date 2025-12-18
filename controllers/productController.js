import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";


export const addProduct = async (req, res) => {
  try {
    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "products" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }).end(file.buffer);
        });

        images.push(uploaded.secure_url);
      }
    }

    const newProduct = await productModel.create({
      ...req.body,
      image: images
    });

    res.json({ success: true, data: newProduct });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// List products
export const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, data: products });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Remove product
export const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.productId);
    res.json({ success: true, message: "Product removed" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Single product
export const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.json({ success: true, data: product });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
