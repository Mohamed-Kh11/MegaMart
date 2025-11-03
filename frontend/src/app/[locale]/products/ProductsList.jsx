"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "../lib/axios.js";

export default function ProductsList({ locale, initialProducts }) {
  const t = useTranslations("products");
  const [products, setProducts] = useState(initialProducts || []);
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // ✅ Fetch current user via HttpOnly cookie
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me", { withCredentials: true });
        setCurrentUser(data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  // ✅ Add to cart (cookie-based if logged in, localStorage otherwise)
  const handleAddToCart = async (product) => {
    const discount = Number(product.discount) || 0;
    const discountedPrice =
      discount > 0 ? product.price * (1 - discount / 100) : product.price;

    // 🧩 Logged in → update user cart in DB
    if (currentUser?._id) {
      try {
        const { data } = await api.get("/users/me", { withCredentials: true });
        const existingCart = Array.isArray(data.cart) ? data.cart : [];
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

        await api.put(
          "/users/me/cart",
          { cart: updatedCart },
          { withCredentials: true }
        );

        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(t("added"));
      } catch (err) {
        console.error("❌ Failed to update DB cart:", err);
        toast.error(t("errorAdding"));
      }
    } else {
      // 🧩 Guest → use localStorage
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
      toast.success(t("added"));
    }
  };

  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  return (
    <section
      className={`w-full py-14 px-4 transition-colors duration-300 ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* --- Title --- */}
      <div className="flex items-center justify-center gap-4 mb-10 px-6">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 whitespace-nowrap">
          {t("title")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* --- Product Grid --- */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.length > 0 ? (
          products.map((product, index) => {
            const discount = Number(product.discount) || 0;
            const discountedPrice =
              discount > 0
                ? (product.price * (1 - discount / 100)).toFixed(2)
                : product.price.toFixed(2);

            return (
              <div
                key={product._id || index}
                className="relative flex flex-col bg-white dark:bg-MegaDark2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-transparent hover:border-[#a28533] h-full"
              >
                {/* 🔥 Discount Tag */}
                {discount > 0 && (
                  <div className="absolute z-20 top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                    -{discount}%
                  </div>
                )}

                {/* 🖼️ Product Image */}
                <div className="relative w-40 h-40 mx-auto mb-4">
                  <Image
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={
                      product.name?.[locale] ||
                      product.name?.en ||
                      "Product"
                    }
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>

                {/* 🏷️ Product Name */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center line-clamp-2 min-h-[3rem]">
                  {product.name?.[locale] || product.name?.en}
                </h3>

                {/* 💰 Price */}
                <p className="text-[#a28533] dark:text-amber-400 text-md font-medium mb-4 text-center mt-auto">
                  {locale === "en" ? "LE" : "جنيه"} {discountedPrice}{" "}
                  {discount > 0 && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {product.price.toFixed(2)}
                    </span>
                  )}
                </p>

                {/* 🛒 Buttons */}
                <div className="flex gap-2 justify-center mt-auto pt-2">
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
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-300 col-span-full">
            {t("noProducts")}
          </p>
        )}
      </div>
    </section>
  );
}
