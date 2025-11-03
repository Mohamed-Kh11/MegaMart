import express from "express";
import upload from "../../middleware/upload.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
} from "../controllers/productController.js";
import { auth, adminOnly } from "../../middleware/authMiddleware.js";

const router = express.Router();

/**
 * PRODUCTS ROUTES
 * Base path: /api/products
 */

// ✅ Public routes (no auth)
router.get("/", getProducts);
router.get("/:id", getProductById);

// 🔒 Admin-only routes
router.post("/", auth, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", auth, adminOnly, upload.array("images", 5), updateProduct);
router.delete("/:id", auth, adminOnly, deleteProduct);

export default router;
