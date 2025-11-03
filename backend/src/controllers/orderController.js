// controllers/orderController.js
import Order from "../../models/Order.js";

/**
 * 🛒 Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    console.log("🟡 Incoming order data:", req.body);
    console.log("🟢 Authenticated user:", req.user);

    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Attach userId from token (ignore client-provided userId)
    const order = new Order({
      ...req.body,
      userId: req.user.id,
    });

    console.log("📦 Final order to save:", order);

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  }
};

/**
 * 👑 Get all orders (admin)
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

/**
 * 📦 Get a single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "userId",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    // 🧠 Allow only the owner or an admin
    if (
      order.userId._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Error fetching order:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

/**
 * 👤 Get all orders for a specific user
 */
export const getUserOrders = async (req, res) => {
  try {
    // 🧠 Only allow the same user or admin
    if (req.user.id !== req.params.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

/**
 * 🚚 Update order status (admin only)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.error("❌ Error updating order:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

/**
 * ❌ Delete an order (admin only)
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ success: true, message: "Order deleted" });
  } catch (err) {
    console.error("❌ Error deleting order:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};
