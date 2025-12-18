import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  category: { type: String, default: "Main" },
  available: { type: Boolean, default: true },
  prepTimeMin: { type: Number, default: 10 }
}, { timestamps: true });

const menuItemModel = mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
export default menuItemModel;
