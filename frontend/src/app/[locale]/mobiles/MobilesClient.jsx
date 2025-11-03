// app/[locale]/mobiles/MobilesClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import FilterBar from "../components/FilterBar.jsx";
import Spinner from "../components/Spinner.jsx";

export default function MobilesClient({ locale }) {
  const t = useTranslations("categories");
  const { category } = useParams();
  const router = useRouter();

  // 🧱 States
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    minPrice: 0,
    maxPrice: Infinity,
  });

  const normalize = (str) =>
    str?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "";

  // 🧩 Fetch Mobiles
  useEffect(() => {
    const fetchMobiles = async () => {
      try {
        const { data } = await api.get("/products");
        const all = Array.isArray(data.products) ? data.products : [];

        const normalizedCategory = normalize(category || "mobiles");

        const filtered = all.filter((p) => {
          const catEn = normalize(p.category?.en);
          const catAr = normalize(p.category?.ar);
          const catLocalized = normalize(p.category?.[locale]);

          const mobileKeywords = [
            "mobile",
            "mobiles",
            "smartphone",
            "smartphones",
            "phone",
            "phones",
            "جوال",
            "الهاتف",
            "هواتف",
          ];

          return (
            mobileKeywords.some((kw) =>
              catEn.includes(kw) || catAr.includes(kw) || catLocalized.includes(kw)
            ) ||
            catEn === normalizedCategory ||
            catAr === normalizedCategory ||
            catLocalized === normalizedCategory
          );
        });

        setAllProducts(filtered);
        setProducts(filtered);
      } catch (err) {
        console.error("❌ Error fetching mobiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMobiles();
  }, [category, locale]);

  // 🧮 Apply Filters (live)
  useEffect(() => {
    let filtered = [...allProducts];

    if (filters.category !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.[locale] === filters.category
      );
    }
    if (filters.brand !== "all") {
      filtered = filtered.filter((p) => p.brand === filters.brand);
    }
    if (filters.minPrice > 0) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== Infinity) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice);
    }

    setProducts(filtered);
  }, [filters, allProducts, locale]);

  // 🔁 Reset Filters
  const handleReset = () => {
    setFilters({
      category: "all",
      brand: "all",
      minPrice: 0,
      maxPrice: Infinity,
    });
  };

  // 📦 Handle Add to Cart
  const handleAddToCart = async (product) => {
    const discountedPrice =
      product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    try {
      // ✅ Fetch user info via protected route (uses JWT cookie)
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
          discount: product.discount || 0,
          discountPrice: discountedPrice,
          quantity: 1,
        });
      }

      // ✅ Update user cart (JWT-authenticated)
      await api.put("/users/me/cart", { cart: updatedCart }, { withCredentials: true });

      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(t("addedToCart"));
    } catch (err) {
      console.warn("⚠️ JWT failed or guest user detected:", err);

      // 🧺 Guest fallback — use localStorage cart
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
      toast.success(t("addedToCart"));
    }
  };


  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  // 🌀 Loading State
  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  // 🚫 No Products
  if (!products.length)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <h2 className="text-2xl font-semibold text-[#a28533] dark:text-amber-400 capitalize">
          {category?.replace(/-/g, " ") || "Mobiles"}
        </h2>
        <p className="text-gray-400">{t("noProducts")}</p>
        <button
          onClick={() => router.push(`/${locale}/`)}
          className="px-6 py-2 mt-2 bg-[#a28533] dark:bg-amber-400 text-white rounded-lg shadow hover:opacity-90 transition"
        >
          {t("goBack")}
        </button>
      </div>
    );

  // ✅ Main Render
  return (
    <section
      className={`w-full py-14 px-4 transition-colors duration-300 ${locale === "ar" ? "text-right" : "text-left"
        }`}
    >
      {/* 🏷️ Title */}
      <div className="flex items-center justify-center gap-4 mb-10 px-6">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 whitespace-nowrap capitalize">
          {category?.replace(/-/g, " ") || t("mobiles")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* 🧭 Filter Bar */}
      <div className="mb-10 container mx-auto px-6">
        <FilterBar
          products={allProducts}
          filters={filters}
          setFilters={setFilters}
          onReset={handleReset}
        />
      </div>

      {/* 📱 Products Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative flex flex-col bg-white dark:bg-MegaDark2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-transparent hover:border-[#a28533] h-full"
          >
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

            {/* 💰 Price */}
            <p className="text-[#a28533] dark:text-amber-400 text-md font-medium mb-4 text-center mt-auto">
              {locale === "en" ? "LE" : "جنيه"} {product.price.toFixed(2)}
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
        ))}
      </div>
    </section>
  );
}
