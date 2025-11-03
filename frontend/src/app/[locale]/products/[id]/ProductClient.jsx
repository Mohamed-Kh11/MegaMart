"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner.jsx";
import { useRouter } from "next/navigation";
import api from "../../lib/axios.js";

export default function ProductClient({ product, locale }) {
  const t = useTranslations("productDetails");
  const router = useRouter();

  const [mainImage, setMainImage] = useState(
    product?.images?.[0]?.url || "/placeholder.png"
  );
  const gallery = useMemo(() => product?.images || [], [product]);

  if (!product)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  const handleAddToCart = async (product) => {
    const discountedPrice =
      product.discount > 0
        ? product.price * (1 - product.discount / 100)
        : product.price;

    try {
      // ✅ Attempt to update user’s cart (cookie-based)
      const { data: userData } = await api.get("/users/me", {
        withCredentials: true,
      });

      const existingCart = userData?.cart || [];
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

      // ✅ Update server cart via /users/me/cart
      await api.put(
        "/users/me/cart",
        { cart: updatedCart },
        { withCredentials: true }
      );

      toast.success(t("addedToCart"));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      // ❌ If user not logged in, fallback to localStorage
      if (err.response?.status === 401) {
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingIndex = localCart.findIndex(
          (item) => item.productId === product._id
        );

        if (existingIndex >= 0) localCart[existingIndex].quantity += 1;
        else
          localCart.push({
            productId: product._id,
            name: product.name,
            image: product.images?.[0]?.url || "/placeholder.png",
            price: product.price,
            discount: product.discount || 0,
            discountPrice: discountedPrice,
            quantity: 1,
          });

        localStorage.setItem("cart", JSON.stringify(localCart));
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success(t("addedToCart"));
      } else {
        console.error("❌ Failed to add item:", err);
        toast.error(t("addError"));
      }
    }
  };

  const detailFields = [
    { key: "sizes", label: t("sizes") },
    { key: "storage", label: t("storage") },
    { key: "warranty", label: t("warranty") },
    { key: "weight", label: t("weight") },
    { key: "colors", label: t("colors") },
    { key: "dimensions", label: t("dimensions") },
  ];

  return (
    <section
      className={`min-h-[90vh] py-10 px-6 md:px-10 transition-colors duration-300 ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* --- Images --- */}
        <div className="flex flex-col md:flex-row gap-4">
          {gallery.length > 0 && (
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
              {gallery.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setMainImage(img.url)}
                  className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 ${
                    mainImage === img.url
                      ? "border-[#a28533]"
                      : "border-transparent hover:border-[#a28533]/50"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-contain bg-white dark:bg-[#111d44] p-1"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="relative flex-1 aspect-square bg-white dark:bg-[#111d44] rounded-2xl overflow-hidden shadow-md">
            <Image
              src={mainImage}
              alt={product.name?.[locale] || "Product image"}
              fill
              className="object-contain p-5 transition-all duration-300"
            />
          </div>
        </div>

        {/* --- Product Info --- */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            {product.name?.[locale]}
          </h1>

          {/* Price + Discount */}
          {product.discount > 0 ? (
            <div className="flex items-baseline gap-2">
              <p className="text-[#a28533] dark:text-amber-400 text-2xl font-semibold">
                {locale === "en" ? "LE" : "جنيه"}{" "}
                {(product.price * (1 - product.discount / 100)).toFixed(2)}
              </p>
              <p className="line-through text-gray-400 text-sm">
                {locale === "en" ? "LE" : "جنيه"} {product.price.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-[#a28533] dark:text-amber-400 text-2xl font-semibold">
              {locale === "en" ? "LE" : "جنيه"} {product.price.toFixed(2)}
            </p>
          )}

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description?.[locale]}
          </p>

          {/* Ratings */}
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={`${
                  i < product.rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-400"
                }`}
              />
            ))}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.numReviews} {t("reviews")})
            </span>
          </div>

          {/* Category & Brand */}
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
            {product.category?.[locale] && (
              <p>
                {t("category")}:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {product.category?.[locale]}
                </span>
              </p>
            )}
            {product.brand && (
              <p>
                {t("brand")}:{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {product.brand}
                </span>
              </p>
            )}
          </div>

          {/* Additional Details */}
          <div className="bg-white dark:bg-[#111d44] rounded-xl p-4 shadow-md">
            <h3 className="text-lg font-semibold text-[#a28533] dark:text-amber-400 mb-2">
              {t("details")}
            </h3>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700 dark:text-gray-300">
              {detailFields.map(({ key, label }) => {
                const value = product[key];
                if (
                  value === null ||
                  value === undefined ||
                  (Array.isArray(value) && value.length === 0) ||
                  (typeof value === "string" && value.trim() === "")
                )
                  return null;
                const displayValue = Array.isArray(value)
                  ? value.join(", ")
                  : value;
                return (
                  <p key={key}>
                    {label}:{" "}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {displayValue}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleAddToCart(product)}
            className="mt-4 px-8 py-3 text-lg font-semibold rounded-lg bg-[#a28533] text-white hover:bg-[#8e7328] transition-all duration-200"
          >
            {t("addToCart")}
          </button>

          <button
            onClick={() => router.push(`/${locale}/products`)}
            className="mt-3 text-[#a28533] hover:underline text-sm"
          >
            ← {t("backToProducts")}
          </button>
        </div>
      </div>

      {/* --- Reviews --- */}
      <div className="max-w-4xl mx-auto mt-20">
        <h2 className="text-2xl font-bold text-[#a28533] dark:text-amber-400 mb-6">
          {t("customerReviews")}
        </h2>
        {product.reviews?.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white dark:bg-[#111d44] rounded-xl p-5 shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <strong className="text-gray-900 dark:text-white">
                    {review.name?.[locale] || "Anonymous"}
                  </strong>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {review.comment?.[locale] || review.comment?.en || ""}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t("noReviews")}</p>
        )}
      </div>
    </section>
  );
}
