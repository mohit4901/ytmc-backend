import express from "express";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  listRestaurantOrders,
  updateRestaurantOrderStatus,
  deleteRestaurantOrder
} from "../controllers/restaurantOrderController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ===============================
// CUSTOMER ROUTES
// ===============================
router.post("/create", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

// ===============================
// ADMIN ROUTES
// ===============================
router.get("/all", adminAuth, listRestaurantOrders);
router.post("/update-status", adminAuth, updateRestaurantOrderStatus);
router.delete("/delete/:id", adminAuth, deleteRestaurantOrder); // 🔥 DELETE ORDER

export default router;
