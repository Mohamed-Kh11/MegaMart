// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: String,
        image: String,
        price: Number,
        quantity: { type: Number, default: 1 },
        discount: { type: Number, default: 0 },
      },
    ],
    total: { type: Number, required: true },
    method: { type: String, enum: ["Credit Card", "Cash on Delivery"], required: true },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },
    phone: String,
    promo: {
      code: String,
      discount: Number,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded"],
      default: "Unpaid",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
