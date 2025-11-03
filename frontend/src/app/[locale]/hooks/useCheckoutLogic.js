"use client";

import { useState } from "react";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

export default function useCheckoutLogic(
  user,
  cart,
  total,
  appliedPromo,
  promoDiscount
) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({});
  const [phone, setPhone] = useState("");

  const handleCheckout = (t) => {
    if (!user?._id) {
      toast.error(t("loginRequired"));
      return;
    }

    if (!Array.isArray(cart) || cart.length === 0) {
      console.error("❌ cart is not an array or empty:", cart);
      toast.error("Cart data invalid");
      return;
    }

    setIsModalOpen(true);
  };

  const buildPayload = (method) => ({
    userId: user._id,
    items: cart.map((item) => ({
      productId: item.productId || item._id,
      // 👇 send English name if it's an object
      name:
        typeof item.name === "object"
          ? item.name.en
          : item.name || item.product?.name,
      image: item.image || item.product?.image,
      price: item.discountPrice || item.product?.price || item.price,
      quantity: item.quantity || 1,
      discount: item.discount || 0,
    })),
    total,
    method, // "Credit Card" or "Cash on Delivery"
    address,
    phone,
    promo: appliedPromo
      ? { code: appliedPromo, discount: promoDiscount || 0 }
      : null,
  });

  const handleStripeCheckout = async () => {
    try {
      setIsProcessing(true);
      const payload = buildPayload("Credit Card");

      await api.post("/orders", payload); // ✅ correct endpoint

      toast.success("Order placed successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Checkout error:", err.response?.data || err.message);
      toast.error("Failed to complete checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODCheckout = async () => {
    try {
      setIsProcessing(true);
      const payload = buildPayload("Cash on Delivery");

      await api.post("/orders", payload); // ✅ correct endpoint

      toast.success("Order placed successfully!");
      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Checkout error (full):", err);
      console.error("👉 err.response:", err.response);
      console.error("👉 err.request:", err.request);
      console.error("👉 err.message:", err.message);
      toast.error("Failed to complete checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isModalOpen,
    setIsModalOpen,
    isProcessing,
    address,
    setAddress,
    phone,
    setPhone,
    handleCheckout,
    handleStripeCheckout,
    handleCODCheckout,
  };
}
