"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import api from "../lib/axios";
import FilterBar from "../components/FilterBar.jsx";
import Spinner from "../components/Spinner";

export default function FashionClient() {
  const locale = useLocale();
  const t = useTranslations("categories");
  const { category } = useParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    minPrice: 0,
    maxPrice: Infinity,
  });
  const [loading, setLoading] = useState(true);

  const normalize = (str) =>
    str?.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]+/g, "-").replace(/^-+|-+$/g, "") || "";

  useEffect(() => {
    const fetchFashion = async () => {
      try {
        const { data } = await api.get("/products");
        const all = Array.isArray(data.products) ? data.products : [];
        const normalizedCategory = normalize(category || "fashion");

        const filtered = all.filter((p) => {
          const catEn = normalize(p.category?.en);
          const catAr = normalize(p.category?.ar);
          const catLocalized = normalize(p.category?.[locale]);

          const fashionKeywords = [
            "fashion",
            "clothes",
            "clothing",
            "apparel",
            "wear",
            "outfit",
            "tshirt",
            "shirt",
            "pants",
            "dress",
            "skirts",
            "shoes",
            "حقائب",
            "ملابس",
            "أزياء",
            "أحذية",
            "حذاء",
          ];

          return (
            fashionKeywords.some((kw) =>
              catEn.includes(kw) || catAr.includes(kw) || catLocalized.includes(kw)
            ) ||
            catEn === normalizedCategory ||
            catAr === normalizedCategory ||
            catLocalized === normalizedCategory
          );
        });

        setProducts(filtered);
        setFiltered(filtered);
      } catch (err) {
        console.error("❌ Error fetching fashion products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFashion();
  }, [category, locale]);

  // ✅ Filters
  useEffect(() => {
    let result = products;

    if (filters.category !== "all") {
      result = result.filter((p) => p.category?.[locale] === filters.category);
    }

    if (filters.brand !== "all") {
      result = result.filter((p) => p.brand === filters.brand);
    }

    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    setFiltered(result);
  }, [filters, products, locale]);

  const resetFilters = () => {
    setFilters({
      category: "all",
      brand: "all",
      minPrice: 0,
      maxPrice: Infinity,
    });
  };

  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  const handleAddToCart = async (product) => {
    const discount = Number(product.discount) || 0;
    const discountedPrice =
      discount > 0 ? product.price * (1 - discount / 100) : product.price;

    try {
      // ✅ Get the logged-in user from cookie-based session
      const { data: me } = await api.get("/users/me", { withCredentials: true });

      if (me?._id) {
        // ✅ Existing cart
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
            discount,
            discountPrice: discountedPrice,
            quantity: 1,
          });
        }

        // ✅ Save to backend
        await api.put(
          "/users/me/cart",
          { cart: updatedCart },
          { withCredentials: true }
        );

        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Added to cart!");
      } else {
        throw new Error("No logged-in user");
      }
    } catch (err) {
      console.warn("⚠️ Falling back to guest cart. Reason:", err.message);

      // 🧺 Guest fallback: localStorage
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


  // ✅ Loading
  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  // ✅ No products
  if (!products.length)
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center space-y-4">
        <h2 className="text-2xl font-semibold text-[#a28533] dark:text-amber-400 capitalize">
          {category?.replace(/-/g, " ") || "Fashion"}
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

  // ✅ Fashion Grid
  return (
    <section
      className={`w-full py-14 px-4 transition-colors duration-300 ${locale === "ar" ? "text-right" : "text-left"
        }`}
    >
      {/* Title */}
      <div className="flex items-center justify-center gap-4 mb-10 px-6">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 whitespace-nowrap capitalize">
          {category?.replace(/-/g, " ") || t("fashion")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* Filters */}
      <FilterBar
        products={products}
        filters={filters}
        setFilters={setFilters}
        onReset={resetFilters}
      />

      {/* Products Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filtered.map((product) => {
          const discount = Number(product.discount) || 0;
          const discountedPrice =
            discount > 0
              ? (product.price * (1 - discount / 100)).toFixed(2)
              : product.price.toFixed(2);

          return (
            <div
              key={product._id}
              className="relative flex flex-col bg-white dark:bg-MegaDark2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-transparent hover:border-[#a28533] h-full"
            >
              {/* 🔥 Discount Tag */}
              {discount > 0 && (
                <div className="absolute z-20 top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                  -{discount}%
                </div>
              )}

              <div className="relative w-40 h-40 mx-auto mb-4">
                <Image
                  src={product.images?.[0]?.url || product.images?.[0] || "/no-image.png"}
                  alt={product.name?.[locale] || "Product"}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>

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
        })}
      </div>
    </section>
  );
}
