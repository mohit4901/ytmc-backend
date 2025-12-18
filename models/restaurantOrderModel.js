import mongoose from "mongoose";

const rOrderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 }
  },
  { _id: false }
);

const restaurantOrderSchema = new mongoose.Schema(
  {
    // 🔹 DAILY KITCHEN ORDER NUMBER (NEW)
    dailyOrderNumber: {
      type: Number,
      required: true
    },

    tableNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },

    items: [rOrderItemSchema],

    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },

    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "paid", "preparing", "ready", "served", "cancelled"],
      default: "pending"
    },

    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const restaurantOrderModel =
  mongoose.models.RestaurantOrder ||
  mongoose.model("RestaurantOrder", restaurantOrderSchema);

export default restaurantOrderModel;
