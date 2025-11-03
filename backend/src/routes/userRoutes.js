import express from "express";
import {
  getUsers,
  registerUser,
  loginUser,
  updateCart,
  updateUserProfile,
  getUserById,
  addOrder,
  logoutUser,
  userRole,
  updateProfile,
  updateMyCart,
} from "../controllers/userController.js";

import { auth, adminOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/profile", auth, updateProfile);


// ✅ Protected routes (logged-in users)
router.get("/me", auth, userRole);
router.get("/:userId", auth, getUserById);
router.put("/me/cart", auth, updateMyCart);
router.put("/:userId/cart", auth, updateCart);
router.put("/:userId/profile", auth, updateUserProfile);
router.post("/:userId/orders", auth, addOrder);

// ✅ Admin-only route
router.get("/", auth, adminOnly, getUsers);

export default router;
