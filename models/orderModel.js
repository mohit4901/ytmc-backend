import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  qty: { type: Number, default: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["stripe", "razorpay", "cod"], default: "razorpay" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  deliveryAddress: { type: String, default: "" },
  status: { type: String, enum: ["placed", "shipped", "delivered", "cancelled"], default: "placed" }
}, { timestamps: true });

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default orderModel;
