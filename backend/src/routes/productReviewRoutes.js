import express from "express";
// import { verifyJWT } from "../../middleware/authMiddleware.js";
import {
  addOrUpdateReview,
  deleteReview,
} from "../controllers/productReviewController.js";

const router = express.Router();

router.post("/:id/reviews",  addOrUpdateReview);
router.delete("/:id/reviews/:reviewId",  deleteReview);

export default router;
