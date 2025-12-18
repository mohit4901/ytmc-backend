import restaurantOrderModel from "../models/restaurantOrderModel.js";
import createRazorpayInstance from "../services/razorpay.js";

// ===============================
// CREATE RAZORPAY ORDER (CUSTOMER)
// ===============================
export const createRazorpayOrder = async (req, res) => {
  try {
    const { tableNumber, customer, items, amount, note } = req.body;

    if (
      !tableNumber ||
      !customer?.name ||
      !customer?.phone ||
      !items ||
      items.length === 0 ||
      !amount
    ) {
      return res.json({
        success: false,
        message: "Missing required fields"
      });
    }

    // 🔹 SUBTOTAL
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    // 🔹 TAX (5%)
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    // ===============================
    // 🔥 DAILY ORDER NUMBER
    // ===============================
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const lastOrderToday = await restaurantOrderModel
      .findOne({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      })
      .sort({ dailyOrderNumber: -1 });

    const dailyOrderNumber = lastOrderToday
      ? lastOrderToday.dailyOrderNumber + 1
      : 1;

    // 🔹 RAZORPAY
    const razorpay = createRazorpayInstance();
    const rpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR"
    });

    // 🔹 SAVE ORDER
    const order = await restaurantOrderModel.create({
      dailyOrderNumber,
      tableNumber,
      customerName: customer.name,
      customerMobile: customer.phone,

      items: items.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.price,
        qty: item.qty
      })),

      subtotal,
      tax,
      total,
      notes: note || "",
      status: "pending",
      razorpayOrderId: rpOrder.id
    });

    res.json({
      success: true,
      razorpayOrder: rpOrder,
      orderId: order._id
    });

  } catch (err) {
    console.error("Create Order Error:", err);
    res.json({ success: false, message: err.message });
  }
};

// ===============================
// VERIFY PAYMENT
// ===============================
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = req.body;

    const order = await restaurantOrderModel.findByIdAndUpdate(
      orderId,
      {
        status: "paid",
        razorpayPaymentId,
        razorpaySignature
      },
      { new: true }
    );

    // 🔥 SEND FULL ORDER TO KITCHEN
    const io = req.app.get("io");
    io.to("kitchen").emit("new-order", order);

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ===============================
// ADMIN: LIST ORDERS
// ===============================
export const listRestaurantOrders = async (req, res) => {
  try {
    const orders = await restaurantOrderModel
      .find({})
      .sort({ createdAt: -1 });

    res.json({ success: true, data: orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ===============================
// ADMIN: UPDATE STATUS
// ===============================
export const updateRestaurantOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await restaurantOrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    const io = req.app.get("io");
    io.to("kitchen").emit("order-updated", order);

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// ===============================
// ADMIN: DELETE ORDER
// ===============================
export const deleteRestaurantOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await restaurantOrderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.json({
        success: false,
        message: "Order not found"
      });
    }

    const io = req.app.get("io");
    io.to("kitchen").emit("order-deleted", { orderId: id });

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.json({ success: false, message: err.message });
  }
};
