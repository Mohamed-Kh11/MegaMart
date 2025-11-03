import mongoose from "mongoose";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ GET all users (without password)
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: err.message });
  }
};

// ✅ REGISTER user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

// ✅ LOGIN user
export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ⏱ Choose duration based on rememberMe
    const expiresIn = rememberMe ? "7d" : "3h";
    const maxAge = rememberMe
      ? 7 * 24 * 60 * 60 * 1000 // 7 days
      : 3 * 60 * 60 * 1000; // 3 hours

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    // ✅ Send JWT as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge,
    });

    res.json({
      message: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logged out successfully" });
};

// ✅ UPDATE user cart
export const updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    let { cart } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array" });
    }

    const sanitizedCart = cart.map((item, index) => {
      if (!item.productId && item._id) item.productId = item._id;
      if (!item.productId)
        throw new Error(`Missing productId at index ${index}`);
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error(`Invalid productId at index ${index}`);
      }

      return {
        productId: new mongoose.Types.ObjectId(item.productId),
        name: item.name || { en: "Unnamed Product", ar: "منتج بدون اسم" },
        price: typeof item.price === "number" ? item.price : 0,
        quantity: item.quantity > 0 ? item.quantity : 1,
        image: item.image || "",
      };
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { cart: sanitizedCart },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Cart updated successfully", cart: user.cart });
  } catch (err) {
    console.error("❌ updateCart error:", err);
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
};

// ✅ UPDATE user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, address } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address && typeof address === "object") {
      user.address = { ...user.address, ...address };
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ updateUserProfile error:", err);
    res
      .status(500)
      .json({ message: "Error updating user profile", error: err.message });
  }
};

// ✅ GET single user by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (typeof user.address === "string" || !user.address) {
      user.address = {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      };
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user", error: err.message });
  }
};

export const userRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ ADD new order (after checkout)
export const addOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { items, total, method, address, phone } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 🟢 Add new order to embedded orders array
    user.orders.push({
      items,
      total,
      method,
      address: address || user.address,
      phone: phone || user.phone,
    });

    // 🧹 Clear cart after order
    user.cart = [];

    await user.save();

    res.json({
      message: "Order placed successfully",
      order: user.orders[user.orders.length - 1],
    });
  } catch (err) {
    console.error("❌ addOrder error:", err);
    res
      .status(500)
      .json({ message: "Error placing order", error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // ✅ use id, not _id
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.address = {
      street: req.body.address?.street || user.address.street,
      city: req.body.address?.city || user.address.city,
      state: req.body.address?.state || user.address.state,
      country: req.body.address?.country || user.address.country,
      postalCode: req.body.address?.postalCode || user.address.postalCode,
    };

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE logged-in user's cart (cookie-based)
export const updateMyCart = async (req, res) => {
  try {
    const userId = req.user.id; // 👈 comes from auth middleware
    const { cart } = req.body;

    if (!Array.isArray(cart)) {
      return res.status(400).json({ message: "Cart must be an array" });
    }

    const sanitizedCart = cart.map((item, index) => {
      if (!item.productId && item._id) item.productId = item._id;
      if (!item.productId)
        throw new Error(`Missing productId at index ${index}`);
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error(`Invalid productId at index ${index}`);
      }

      return {
        productId: new mongoose.Types.ObjectId(item.productId),
        name: item.name || { en: "Unnamed Product", ar: "منتج بدون اسم" },
        price: typeof item.price === "number" ? item.price : 0,
        quantity: item.quantity > 0 ? item.quantity : 1,
        image: item.image || "",
      };
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { cart: sanitizedCart },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Cart updated successfully", cart: user.cart });
  } catch (err) {
    console.error("❌ updateMyCart error:", err);
    res
      .status(500)
      .json({ message: "Error updating cart", error: err.message });
  }
};

// ✅ GET current logged-in user (cookie-based)
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("❌ getMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
