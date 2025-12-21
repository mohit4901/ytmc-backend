import mongoose from "mongoose";

/* =====================================================
   ORDER ITEM SCHEMA (UPGRADED)
===================================================== */
const rOrderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem"
    },

    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },

    // 🔥 NEW (FRONTEND MATCH)
    extraPrice: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },

    customisations: { type: Object, default: {} },
    note: { type: String, default: "" }
  },
  { _id: false }
);

/* =====================================================
   RESTAURANT ORDER SCHEMA
===================================================== */
const restaurantOrderSchema = new mongoose.Schema(
  {
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
