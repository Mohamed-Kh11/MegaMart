// server.js (or index.js)
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import testRoutes from "./routes/testRoutes.js";


const app = express();

// -------------------------
// MIDDLEWARE
// -------------------------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "https://megamart.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// -------------------------
// ROUTES
// -------------------------
app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Backend running fine on Vercel" });
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api", paymentRoutes);
app.use("/api/orders", orderRoutes);


// -------------------------
// GLOBAL ERROR HANDLER
// -------------------------
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
});

// -------------------------
// DATABASE CONNECTION (lazy)
// -------------------------
let isConnected = false;
async function ensureDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}
await ensureDB();

// -------------------------
// EXPORT FOR VERCEL
// -------------------------
export default app;
