import express from "express";
import auth from "../middleware/auth.js";
import { placeOrder, verifyOrder, userOrders, listOrders, updateOrderStatus } from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Ecommerce checkout
router.post("/place", auth, placeOrder);
router.post("/verify", verifyOrder);

// User order history
router.get("/user-orders", auth, userOrders);

// Admin
router.get("/list", adminAuth, listOrders);
router.post("/update-status", adminAuth, updateOrderStatus);

export default router;
