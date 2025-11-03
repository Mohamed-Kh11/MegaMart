// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { auth, adminOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new order (logged-in users)
router.post("/", auth, createOrder);

// ✅ Get all orders for a specific user
router.get("/user/:userId", auth, getUserOrders);

// ✅ Get a single order (owner or admin)
router.get("/:id", auth, getOrderById);

// 🔒 Get all orders (admin only)
router.get("/", auth, adminOnly, getAllOrders);

// 🔒 Update order status (admin only)
router.put("/:id/status", auth, adminOnly, updateOrderStatus);

// 🔒 Delete order (admin only)
router.delete("/:id", auth, adminOnly, deleteOrder);

export default router;
