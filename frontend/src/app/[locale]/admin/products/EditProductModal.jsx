"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function EditProductModal({ product, onClose, onSave, isNew = false }) {
  const t = useTranslations("admin");

  // ✅ Converts Arabic digits → English digits → Number
  const normalizeNumber = (value) => {
    if (typeof value === "string") {
      const arabicToEnglish = value.replace(/[٠-٩]/g, (d) =>
        "٠١٢٣٤٥٦٧٨٩".indexOf(d)
      );
      return Number(arabicToEnglish) || 0;
    }
    return Number(value) || 0;
  };

  const [form, setForm] = useState({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    category: { en: "", ar: "" },
    brand: "",
    price: 0,
    discount: 0,
    stock: 0,
    mainImage: { url: "", public_id: "" },
    images: [],
    _id: "",
  });

  useEffect(() => {
    if (product && product._id) {
      console.log("✅ Syncing product into form:", product._id);
      setForm({
        name: { en: product.name?.en || "", ar: product.name?.ar || "" },
        description: {
          en: product.description?.en || "",
          ar: product.description?.ar || "",
        },
        category: {
          en: product.category?.en || "",
          ar: product.category?.ar || "",
        },
        brand: product.brand || "",
        price: product.price || 0,
        discount: product.discount || 0,
        stock: product.stock || 0,
        mainImage: product.mainImage || { url: "", public_id: "" },
        images: (product.images || []).map((img) => ({ ...img })), // copy
        _id: product._id,
      });
    } else if (product && !product._id) {
      console.log("🆕 Preparing new product form");
      setForm({
        name: { en: "", ar: "" },
        description: { en: "", ar: "" },
        category: { en: "", ar: "" },
        brand: "",
        price: 0,
        discount: 0,
        stock: 0,
        mainImage: { url: "", public_id: "" },
        images: [],
        _id: "",
      });
    } else {
      console.warn("⚠️ EditProductModal opened without product prop", product);
    }
  }, [product]);

  const handleChange = (path, value) => {
    setForm((prev) => {
      const newForm = structuredClone(prev);
      const keys = path.split(".");
      let ref = newForm;
      while (keys.length > 1) ref = ref[keys.shift()];
      ref[keys[0]] = value;
      return newForm;
    });
  };

  // ✅ Normalized numeric input handler
  const handleNumericChange = (path, value) => {
    const normalized = normalizeNumber(value);
    handleChange(path, normalized);
  };

  // Main image file handling
  const handleMainImageFile = (file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    handleChange("mainImage", { file, preview });
  };

  // Gallery upload handling
  const handleGalleryFiles = (files) => {
    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...previews],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const removeMainImage = () => {
    setForm((prev) => ({ ...prev, mainImage: { url: "", public_id: "" } }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#111d44] rounded-xl w-full max-w-5xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 pt-4 pb-3 border-b dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {isNew ? t("addProduct") || "Add Product" : t("editProduct") || "Edit Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-2xl font-bold"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              value={form.name.en}
              onChange={(e) => handleChange("name.en", e.target.value)}
              placeholder={t("nameEn") || "Name (English)"}
            />
            <input
              className="border p-2 rounded"
              value={form.name.ar}
              onChange={(e) => handleChange("name.ar", e.target.value)}
              placeholder={t("nameAr") || "Name (Arabic)"}
            />

            <textarea
              className="border p-2 rounded md:col-span-2"
              value={form.description.en}
              onChange={(e) => handleChange("description.en", e.target.value)}
              placeholder={t("descEn") || "Description (English)"}
              rows={2}
            />
            <textarea
              className="border p-2 rounded md:col-span-2"
              value={form.description.ar}
              onChange={(e) => handleChange("description.ar", e.target.value)}
              placeholder={t("descAr") || "Description (Arabic)"}
              rows={2}
            />

            <input
              className="border p-2 rounded"
              value={form.category.en}
              onChange={(e) => handleChange("category.en", e.target.value)}
              placeholder={t("catEn") || "Category (English)"}
            />
            <input
              className="border p-2 rounded"
              value={form.category.ar}
              onChange={(e) => handleChange("category.ar", e.target.value)}
              placeholder={t("catAr") || "Category (Arabic)"}
            />

            <input
              className="border p-2 rounded"
              value={form.brand}
              onChange={(e) => handleChange("brand", e.target.value)}
              placeholder={t("brand") || "Brand"}
            />

            {/* ✅ Updated numeric fields with normalization */}
            <input
              type="text"
              inputMode="numeric"
              className="border p-2 rounded"
              value={form.price || ""}
              onChange={(e) => handleNumericChange("price", e.target.value)}
              placeholder={t("pricePlaceholder") || "Enter price (e.g. 1200)"}
            />
            <input
              type="text"
              inputMode="numeric"
              className="border p-2 rounded"
              value={form.discount || ""}
              onChange={(e) => handleNumericChange("discount", e.target.value)}
              placeholder={t("discountPlaceholder") || "Enter discount (%)"}
            />
            <input
              type="text"
              inputMode="numeric"
              className="border p-2 rounded"
              value={form.stock || ""}
              onChange={(e) => handleNumericChange("stock", e.target.value)}
              placeholder={t("stockPlaceholder") || "Enter stock quantity"}
            />

            {/* Main Image */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-700 dark:text-gray-200 mb-1">
                {t("mainImage") || "Main Image"}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleMainImageFile(file);
                }}
                className="border p-2 rounded"
              />

              {form.mainImage?.preview || form.mainImage?.url ? (
                <div className="flex items-start gap-3 mt-2">
                  <Image
                    src={form.mainImage.preview || form.mainImage.url}
                    alt="Main"
                    width={120}
                    height={120}
                    className="rounded-md object-contain mt-2 border"
                  />
                  <button
                    onClick={removeMainImage}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </div>

            {/* Gallery */}
            <div className="md:col-span-2">
              <p className="font-medium text-gray-700 dark:text-gray-200 mb-2">
                {t("galleryImages") || "Gallery Images"}
              </p>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  handleGalleryFiles(files);
                }}
                className="border p-2 rounded w-full"
              />

              <div className="flex gap-2 flex-wrap mt-2">
                {form.images?.map((img, i) => (
                  <div key={i} className="relative">
                    <Image
                      src={img.preview || img.url}
                      alt={`Image ${i + 1}`}
                      width={70}
                      height={70}
                      className="rounded-md object-cover border"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs"
                      aria-label={`Remove image ${i + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
          >
            {t("cancel") || "Cancel"}
          </button>
          <button
            onClick={() => {
              if (!form._id && !isNew) {
                console.error("🚫 No _id in form before save (edit mode):", form);
                alert("Missing product ID — please close and reopen the editor.");
                return;
              }
              onSave(form, isNew);
            }}
            className="px-4 py-2 rounded bg-[#a28533] text-white hover:bg-[#8e7328]"
          >
            {isNew ? t("create") || "Create" : t("save") || "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

