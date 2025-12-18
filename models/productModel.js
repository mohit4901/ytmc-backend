import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  image: { type: [String], default: [] }, // ecommerce supported array
  category: { type: String, default: "General" },
  subCategory: { type: String, default: "" },
  available: { type: Boolean, default: true },
  stock: { type: Number, default: 0 }
}, { timestamps: true });

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
export default productModel;
