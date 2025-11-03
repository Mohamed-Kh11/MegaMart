"use client";

import { useTranslations, useLocale } from "next-intl";

export default function FilterBar({ products, filters, setFilters, onReset }) {
  const t = useTranslations("filters");
  const locale = useLocale();

  // Extract unique categories & brands dynamically
  const categories = [...new Set(products.map((p) => p.category?.[locale]))];
  const brands = [...new Set(products.map((p) => p.brand))];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-10 px-6">
      {/* Category Filter */}
      <select
        value={filters.category}
        onChange={(e) =>
          setFilters({ ...filters, category: e.target.value })
        }
        className="border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-MegaDark2 text-gray-800 dark:text-gray-200"
      >
        <option value="all">{t("allCategories")}</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Brand Filter */}
      <select
        value={filters.brand}
        onChange={(e) =>
          setFilters({ ...filters, brand: e.target.value })
        }
        className="border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-MegaDark2 text-gray-800 dark:text-gray-200"
      >
        <option value="all">{t("allBrands")}</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      {/* Price Range Inputs */}
      <input
        type="number"
        placeholder={t("minPrice")}
        onChange={(e) =>
          setFilters({ ...filters, minPrice: Number(e.target.value) || 0 })
        }
        className="w-28 border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-MegaDark2 text-gray-800 dark:text-gray-200"
      />
      <input
        type="number"
        placeholder={t("maxPrice")}
        onChange={(e) =>
          setFilters({
            ...filters,
            maxPrice: Number(e.target.value) || Infinity,
          })
        }
        className="w-28 border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-MegaDark2 text-gray-800 dark:text-gray-200"
      />

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="px-4 py-2 bg-[#a28533] text-white rounded-lg hover:bg-[#8e7328] transition"
      >
        {t("reset")}
      </button>
    </div>
  );
}
