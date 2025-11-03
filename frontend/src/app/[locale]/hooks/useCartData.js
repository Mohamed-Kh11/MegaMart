"use client";

import { useState, useEffect } from "react";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

export default function useCartData() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);

  // ✅ Fetch user + cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get("/users/me"); // cookie-based
        if (data) {
          setUser(data);
          const serverCart = Array.isArray(data.cart) ? data.cart : [];
          const enriched = await enrichCartItems(serverCart);
          setCart(enriched);
        } else {
          const localCartRaw = JSON.parse(localStorage.getItem("cart")) || [];
          const enriched = await enrichCartItems(localCartRaw);
          setCart(enriched);
        }
      } catch (err) {
        console.error("❌ Error fetching cart:", err.message);
        const localCartRaw = JSON.parse(localStorage.getItem("cart")) || [];
        const enriched = await enrichCartItems(localCartRaw);
        setCart(enriched);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ Enrich items with product data
const enrichCartItems = async (cartItems) => {
  return Promise.all(
    cartItems.map(async (item) => {
      try {
        const { data } = await api.get(`/products/${item.productId}`);
        const discount = Number(data.discount) || 0;
        const basePrice = data.price || item.price;
        const discountPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

        return {
          ...item,
          product: data,
          price: basePrice,
          discount,
          discountPrice,
        };
      } catch {
        const discount = Number(item.discount) || 0;
        const basePrice = item.price;
        const discountPrice = discount > 0 ? basePrice * (1 - discount / 100) : basePrice;

        return {
          ...item,
          discount,
          discountPrice,
        };
      }
    })
  );
};


  // ✅ Save cart (server or local)
  const saveCart = async (updatedCart) => {
    setCart(updatedCart);
    try {
      if (user) {
        const { data } = await api.put(`/users/${user._id}/cart`, { cart: updatedCart });
        console.log("✅ Cart updated on backend:", data);
      } else {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      }
    } catch (err) {
      console.error("❌ Error saving cart:", err.message);
    }
  };

  // ✅ Handle quantity
  const handleQuantity = (productId, delta) => {
    const updated = cart.map((item) =>
      item.productId === productId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    saveCart(updated);
  };

  // ✅ Handle remove
  const handleRemove = (productId) => {
    const updated = cart.filter((item) => item.productId !== productId);
    saveCart(updated);
    toast.success("Item removed from cart");
  };

  // ✅ Cart totals
const subtotal = cart.reduce(
  (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
  0
);


  const total = appliedPromo
    ? subtotal * (1 - appliedPromo.discount / 100)
    : subtotal;

  // ✅ Promo logic
  const applyPromo = () => {
    const validCodes = { MEGA10: 10, MEGA20: 20 };
    const code = promoCode.trim().toUpperCase();
    const discount = validCodes[code];
    if (discount) {
      setAppliedPromo({ code, discount });
      setPromoDiscount(discount);
      toast.success(`Promo ${code} applied!`);
    } else {
      toast.error("Invalid promo code");
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoCode("");
    toast("Promo removed");
  };

  // ✅ Safe image function
  const getSafeImage = (image) => {
    if (!image) return "/placeholder.png";
    if (Array.isArray(image)) return image[0];
    if (typeof image === "object" && image.url) return image.url;
    return image;
  };

  return {
    cart,
    user,
    loading,
    total,
    promoCode,
    setPromoCode,
    appliedPromo,
    promoDiscount,
    applyPromo,
    removePromo,
    handleQuantity,
    handleRemove,
    getSafeImage, // ✅ Added back
  };
}
