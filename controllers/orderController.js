import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import createRazorpayInstance from "../services/razorpay.js";

// Place ecommerce order
export const placeOrder = async (req, res) => {
  try {
    const { items, subtotal, total } = req.body;

    const razorpay = createRazorpayInstance();

    const rpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR"
    });

    const order = await orderModel.create({
      user: req.userId,
      items,
      subtotal,
      total,
      razorpayOrderId: rpOrder.id
    });

    res.json({ success: true, orderId: order._id, rpOrder });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Verify ecommerce payment
export const verifyOrder = async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    await orderModel.findByIdAndUpdate(orderId, {
      paymentStatus: "paid"
    });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// User orders
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ user: req.userId });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Admin list
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// Admin update status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
