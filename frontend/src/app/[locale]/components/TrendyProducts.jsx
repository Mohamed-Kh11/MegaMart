"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import api from "../lib/axios"; // ✅ Adjust path if needed

export default function TrendyProducts() {
  const t = useTranslations("trendy");
  const locale = useLocale();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const { data } = await api.get("/products");
        const all = Array.isArray(data.products) ? data.products : [];

        if (all.length === 0) {
          setProducts([]);
          return;
        }

        // Shuffle & pick 4 random
        const randomFour = all.sort(() => 0.5 - Math.random()).slice(0, 4);
        setProducts(randomFour);
      } catch (err) {
        console.error("❌ Error fetching trendy products:", err);
        toast.error(t("error"));
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, [locale]);

  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[50vh] text-gray-500 dark:text-gray-300">
        {t("loading")}...
      </div>
    );

  if (!products.length)
    return (
      <div className="text-center py-20 text-gray-500 dark:text-gray-300">
        {t("noProducts")}
      </div>
    );

  return (
    <section
      className={`w-full py-14 px-8 bg-amber-50 dark:bg-[#0b132d] transition-colors duration-300 ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* --- Section Title --- */}
      <div className="flex items-center justify-center gap-4 mb-10 px-6">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 whitespace-nowrap">
          {t("title")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* --- Product Cards --- */}
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="flex flex-col bg-white dark:bg-[#111d44] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-transparent hover:border-[#a28533] h-full"
          >
            {/* Image */}
            <div className="relative w-40 h-40 mx-auto mb-4">
              <Image
                src={product.images?.[0]?.url || product.images?.[0] || "/no-image.png"}
                alt={product.name?.[locale] || "Product"}
                fill
                className="object-contain rounded-lg"
              />
            </div>

            {/* Name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-center line-clamp-2 min-h-[3rem]">
              {product.name?.[locale]}
            </h3>

            {/* Price — equal gap above button */}
            <p className="text-[#a28533] dark:text-amber-400 text-md font-medium mb-5 text-center mt-auto">
              {locale === "en" ? "LE" : "جنيه"} {product.price}
            </p>

            {/* Button */}
            <button
              onClick={() => handleView(product._id)}
              className="mt-auto px-5 py-2 text-sm font-medium rounded-lg bg-[#a28533] text-white hover:bg-[#8e7328] transition-all duration-200"
            >
              {t("view")}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
