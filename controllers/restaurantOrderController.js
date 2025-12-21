import crypto from "crypto";
import restaurantOrderModel from "../models/restaurantOrderModel.js";
import createRazorpayInstance from "../services/razorpay.js";

/* =====================================================
   CREATE RAZORPAY ORDER (NO DB SAVE, NO SOCKET)
===================================================== */
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body; // ✅ FIX

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    const razorpay = createRazorpayInstance();

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    return res.status(200).json({
      success: true,
      razorpayOrderId: order.id
    });
  } catch (error) {
    console.error("Razorpay Create Error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to create Razorpay order"
    });
  }
};

/* =====================================================
   VERIFY PAYMENT → SAVE ORDER → EMIT TO KITCHEN
===================================================== */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      tableNumber,
      customerName,
      customerMobile,
      items,
      subtotal,
      tax,
      total,
      notes
    } = req.body;

    // 🔐 VERIFY SIGNATURE
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // 🔢 DAILY ORDER NUMBER
    const todayCount = await restaurantOrderModel.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    // ✅ FIX: FORMAT ITEMS AS PER SCHEMA
    const formattedItems = items.map((i) => ({
      menuItem: i._id, // REQUIRED BY SCHEMA
      name: i.name,
      price: i.price,
      qty: i.qty
    }));

    // 💾 SAVE ORDER
    const newOrder = await restaurantOrderModel.create({
      dailyOrderNumber: todayCount + 1,

      tableNumber,
      customerName,
      customerMobile,

      items: formattedItems, // ✅ FIXED
      subtotal,
      tax,
      total,

      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,

      status: "paid",
      notes
    });

    // 🔔 EMIT TO KITCHEN (SAFE)
    const io = req.app.get("io");
    if (io) {
      io.to("kitchen").emit("new-order", newOrder);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified & order placed",
      order: newOrder
    });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during payment verification"
    });
  }
};

/* =====================================================
   ADMIN – LIST ORDERS
===================================================== */
export const listRestaurantOrders = async (_, res) => {
  try {
    const orders = await restaurantOrderModel
      .find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/* =====================================================
   ADMIN – UPDATE STATUS
===================================================== */
export const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const updated = await restaurantOrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/* =====================================================
   ADMIN – DELETE ORDER
===================================================== */
export const deleteRestaurantOrder = async (req, res) => {
  try {
    await restaurantOrderModel.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
};

