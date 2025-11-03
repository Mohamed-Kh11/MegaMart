import mongoose from "mongoose";

// --- Order sub-schema ---
const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: {
          en: { type: String, required: true },
          ar: { type: String, required: true },
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],
    total: { type: Number, required: true },
    method: { type: String, enum: ["Cash on Delivery", "Credit Card"], required: true },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },
    phone: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Preparing", "Shipped", "Delivered"],
      default: "Preparing",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

// --- User schema ---
const userSchema = new mongoose.Schema(
  {
    // Basic info
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },

    // Personal info
    phone: { type: String, default: "" },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

    // Account info
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },

    // Cart (embedded)
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: {
          en: { type: String, required: true },
          ar: { type: String, required: true },
        },
        price: { type: Number, default: 0 },
        quantity: { type: Number, default: 1 },
        image: { type: String },
      },
    ],

    // Wishlist
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // ✅ Embedded Orders
    orders: [orderSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
