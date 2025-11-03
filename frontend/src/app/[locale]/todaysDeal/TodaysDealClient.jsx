"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import Spinner from "../components/Spinner";

export default function TodaysDealClient() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch products with discounts
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const { data } = await api.get("/products");
        const all = Array.isArray(data.products) ? data.products : [];
        const discounted = all.filter((p) => p.discount > 0);
        setProducts(discounted);
      } catch (err) {
        console.error("❌ Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  const handleAddToCart = async (product) => {
    const discount = Number(product.discount) || 0;
    const discountedPrice =
      discount > 0 ? product.price * (1 - discount / 100) : product.price;

    try {
      // ✅ Get the authenticated user using JWT cookie
      const { data } = await api.get("/users/me", { withCredentials: true });
      const existingCart = data.cart || [];
      const updatedCart = [...existingCart];

      const index = updatedCart.findIndex(
        (item) => item.productId === product._id
      );

      if (index >= 0) {
        updatedCart[index].quantity += 1;
      } else {
        updatedCart.push({
          productId: product._id,
          name: product.name,
          image: product.images?.[0]?.url || "/placeholder.png",
          price: product.price,
          discount,
          discountPrice: discountedPrice,
          quantity: 1,
        });
      }

      // ✅ Update using JWT-protected route
      await api.put("/users/me/cart", { cart: updatedCart }, { withCredentials: true });
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart!");
    } catch (err) {
      console.warn("⚠️ JWT not found or user not logged in:", err);

      // Fallback: localStorage cart for guest users
      const localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = localCart.findIndex(
        (item) => item.productId === product._id
      );

      if (existingIndex >= 0) {
        localCart[existingIndex].quantity += 1;
      } else {
        localCart.push({
          productId: product._id,
          name: product.name,
          image: product.images?.[0]?.url || "/placeholder.png",
          price: product.price,
          discount,
          discountPrice: discountedPrice,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart!");
    }
  };


  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  if (!products.length)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
        <h2 className="text-2xl font-semibold text-[#a28533] dark:text-amber-400">
          {t("todaysDeal")}
        </h2>
        <p className="text-gray-400">{t("noDeals")}</p>
        <button
          onClick={() => router.push(`/${locale}/`)}
          className="px-6 py-2 mt-2 bg-[#a28533] text-white rounded-lg hover:bg-[#8e7328] transition"
        >
          {t("goBack")}
        </button>
      </div>
    );

  return (
    <section
      className={`w-full py-14 px-4 transition-colors duration-300 ${locale === "ar" ? "text-right" : "text-left"
        }`}
    >
      {/* Section Title */}
      <div className="flex items-center justify-center gap-4 mb-10 px-6">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 whitespace-nowrap capitalize">
          🎉 {t("todaysDeal")} 🎉
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* Subtitle */}
      <div className="text-center mb-8">
        <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
          {t("limitedTimeOffer")} – {t("hurryUp")}
        </p>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative bg-white dark:bg-MegaDark2 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-5 flex flex-col items-center border-2 border-transparent hover:border-[#a28533]"
          >
            {/* Discount tag */}
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow z-20">
              -{product.discount}%
            </div>

            <div className="relative w-40 h-40 mb-4">
              <Image
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.name?.[locale] || "Product"}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
              {product.name?.[locale]}
            </h3>

            {/* Discounted price display */}
            <p className="text-[#a28533] dark:text-amber-400 text-md font-medium mb-1 text-center">
              {locale === "en" ? "LE" : "جنيه"}{" "}
              {(product.price * (1 - product.discount / 100)).toFixed(2)}{" "}
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.price}
              </span>
            </p>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleView(product._id)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-[#1e2a56] dark:text-white dark:hover:bg-[#172555] transition-all duration-200"
              >
                {t("view")}
              </button>
              <button
                onClick={() => handleAddToCart(product)}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#a28533] text-white hover:bg-[#8e7328] transition-all duration-200"
              >
                {t("addToCart")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
