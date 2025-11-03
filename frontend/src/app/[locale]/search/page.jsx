"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { toast } from "react-hot-toast";
import api from "../lib/axios.js";
import FilterBar from "../components/FilterBar.jsx"; // adjust path if needed
import Spinner from "../components/Spinner.jsx";

export default function SearchPage() {
  const t = useTranslations("search");
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();

  const [allProducts, setAllProducts] = useState([]); // full API list
  const [results, setResults] = useState([]); // search results before filters
  const [filtered, setFiltered] = useState([]); // search results after filters
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    minPrice: 0,
    maxPrice: Infinity,
  });

  const query = searchParams.get("query")?.toLowerCase() || "";

  // Fetch all products once
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        const list = Array.isArray(res.data.products)
          ? res.data.products
          : res.data.data || [];
        setAllProducts(list);
      } catch (err) {
        console.error("Search fetch error:", err);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Run search whenever query or allProducts change
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setFiltered([]);
      return;
    }

    setLoading(true);
    try {
      const filteredByQuery = (allProducts || []).filter((p) => {
        const name =
          typeof p.name === "object"
            ? `${p.name.en || ""} ${p.name.ar || ""}`.toLowerCase()
            : (p.name || "").toLowerCase();

        const category =
          typeof p.category === "object"
            ? `${p.category.en || ""} ${p.category.ar || ""}`.toLowerCase()
            : (p.category || "").toLowerCase();

        const description =
          typeof p.description === "object"
            ? `${p.description.en || ""} ${p.description.ar || ""}`.toLowerCase()
            : (p.description || "").toLowerCase();

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      });

      setResults(filteredByQuery);
      // initialize filtered with same list (filters may change it)
      setFiltered(filteredByQuery);
      // reset filters to default so user sees complete search set initially
      setFilters({
        category: "all",
        brand: "all",
        minPrice: 0,
        maxPrice: Infinity,
      });
    } catch (err) {
      console.error("Search processing error:", err);
      setResults([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  }, [query, allProducts]);

  // Apply filter bar to current search results
  useEffect(() => {
    let list = results.slice();

    if (filters.category !== "all") {
      list = list.filter((p) => {
        const cat = typeof p.category === "object" ? p.category[locale] : p.category;
        return cat === filters.category;
      });
    }

    if (filters.brand !== "all") {
      list = list.filter((p) => p.brand === filters.brand);
    }

    list = list.filter(
      (p) =>
        Number(p.price) >= Number(filters.minPrice || 0) &&
        Number(p.price) <= Number(filters.maxPrice === Infinity ? Number.MAX_SAFE_INTEGER : filters.maxPrice)
    );

    setFiltered(list);
  }, [filters, results, locale]);

  const handleView = (id) => router.push(`/${locale}/products/${id}`);

  const handleAddToCart = async (product) => {
    const discountedPrice =
      product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    try {
      // ✅ Get user info from protected route (uses JWT cookie)
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

      // ✅ Update DB cart for authenticated user
      await api.put("/users/me/cart", { cart: updatedCart }, { withCredentials: true });

      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart!");
    } catch (err) {
      console.warn("⚠️ JWT failed or guest user detected:", err);

      // 🧺 Fallback: guest users → localStorage cart
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

  return (
    <section
      className={`w-full py-14 px-8 transition-colors duration-300 ${locale === "ar" ? "text-right" : "text-left"
        }`}
    >
      <h1 className="text-3xl font-extrabold text-[#a28533] dark:text-amber-400 text-center mb-6">
        {t("resultsFor", { query })}
      </h1>

      {/* FilterBar */}
      <div className="mb-8 container mx-auto px-6">
        <FilterBar
          products={results}
          filters={filters}
          setFilters={setFilters}
          onReset={() =>
            setFilters({ category: "all", brand: "all", minPrice: 0, maxPrice: Infinity })
          }
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-300">
          {t("noResults", { query })}
        </p>
      ) : (
        <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((product) => {
            const price = Number(product.price || 0);
            const discount = Number(product.discount) || 0;
            const discountedPrice = discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price.toFixed(2);

            return (
              <div
                key={product._id}
                className="relative flex flex-col bg-white dark:bg-MegaDark2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border-2 border-transparent hover:border-[#a28533] h-full"
              >
                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute z-20 top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                    -{discount}%
                  </div>
                )}

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
                  {product.name?.[locale] || product.name}
                </h3>

                {/* Price */}
                <p className="text-[#a28533] dark:text-amber-400 text-md font-medium mb-4 text-center mt-auto">
                  {locale === "en" ? "LE" : "جنيه"} {discountedPrice}
                  {discount > 0 && (
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {price.toFixed(2)}
                    </span>
                  )}
                </p>

                {/* Buttons */}
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
      )}
    </section>
  );
}
