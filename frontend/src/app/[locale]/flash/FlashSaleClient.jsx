"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import Spinner from "../components/Spinner";

export default function FlashSaleClient() {
  const t = useTranslations("categories");
  const locale = useLocale();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch and pick random 8 products
  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const { data } = await api.get("/products");
        const all = Array.isArray(data.products) ? data.products : [];

        // Shuffle and slice 8 random products
        const shuffled = all.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 8);

        setProducts(selected);
      } catch (err) {
        console.error("❌ Error fetching flash sale products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  const handleAddToCart = async (product) => {
    try {
      // 🧮 Calculate discounted price
      const discountedPrice =
        product.discount > 0
          ? product.price * (1 - product.discount / 100)
          : product.price;

      // ✅ Check if user is authenticated (cookie-based)
      const { data: me } = await api.get("/users/me", { withCredentials: true });

      if (me?._id) {
        // ✅ Logged-in user — fetch existing cart from server
        const existingCart = Array.isArray(me.cart) ? me.cart : [];

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
            discount: product.discount || 0,
            discountPrice: discountedPrice,
            quantity: 1,
          });
        }

        // ✅ PUT to /users/me/cart with cookie-based auth
        await api.put(
          "/users/me/cart",
          { cart: updatedCart },
          { withCredentials: true }
        );

        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart!");
      } else {
        throw new Error("No user found");
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err.message);

      // 🧺 Fallback: Guest user → store in localStorage
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
          discount: product.discount || 0,
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
          {t("flashSale")}
        </h2>
        <p className="text-gray-400">{t("noProducts")}</p>
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
      {/* --- Section Title --- */}
      <div className="flex items-center justify-center gap-4 mb-10 px-6">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 whitespace-nowrap capitalize">
          ⚡ {t("flashSale")} ⚡
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* --- Countdown Timer (optional, static example) --- */}
      <div className="text-center mb-8">
        <p className="text-gray-600 dark:text-gray-300 font-medium text-lg">
          {t("limitedTimeOffer")} – {t("hurryUp")}
        </p>
      </div>

      {/* --- Product Grid --- */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative flex flex-col bg-white dark:bg-MegaDark2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-transparent hover:border-[#a28533] h-full"
          >
            {/* ⚡ Flash tag */}
            <div className="absolute z-20 top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
              {t("flash")}
            </div>

            {/* 🖼️ Image */}
            <div className="relative w-40 h-40 mx-auto mb-4">
              <Image
                src={product.images?.[0]?.url || product.images?.[0] || "/no-image.png"}
                alt={product.name?.[locale] || "Product"}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            {/* 🏷️ Name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center line-clamp-2 min-h-[3rem]">
              {product.name?.[locale]}
            </h3>

            {/* 💰 Price — pinned above buttons */}
            <p className="text-[#a28533] dark:text-amber-400 text-md font-medium mb-4 text-center mt-auto">
              {locale === "en" ? "LE" : "جنيه"} {(product.price * 0.85).toFixed(2)}{" "}
              <span className="text-sm text-gray-400 line-through ml-2">
                {product.price.toFixed(2)}
              </span>
            </p>

            {/* 🛒 Buttons — evenly aligned */}
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

        ))}
      </div>
    </section>
  );
}
