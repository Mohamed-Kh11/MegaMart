"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import api from "../lib/axios.js";
import { Search } from 'lucide-react';


export default function SearchBar() {
  const t = useTranslations("search");
  const locale = useLocale();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);

  // Fetch suggestions dynamically while typing
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    // Debounce search (wait for 400ms after typing)
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products?keyword=${encodeURIComponent(query)}`);
        const all = Array.isArray(res.data.products)
          ? res.data.products
          : res.data.data || [];

        setSuggestions(all.slice(0, 5)); // show only top 5
      } catch (err) {
        console.error("Live search error:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  // Handle full search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/${locale}/search?query=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };

  // Handle click on suggestion
  const handleSelect = (productId) => {
    router.push(`/${locale}/products/${productId}`);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex items-center bg-white dark:bg-[#152453] rounded-full shadow px-4 py-2">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder={t("placeholder")}
          className="flex-grow bg-transparent focus:outline-none text-gray-800 dark:text-gray-100"
        />
        <button
          type="submit"
          className=" bg-MegaLight hover:bg-[#8e7328] text-white px-4 py-1 rounded-full transition-all"
        >
          <Search />
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 bg-white dark:bg-[#152453] mt-2 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">
          {loading ? (
            <li className="p-3 text-center text-gray-500">{t("loading")}</li>
          ) : (
            suggestions.map((s) => (
              <li
                key={s._id}
                onClick={() => handleSelect(s._id)}
                className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#1b2b5a] cursor-pointer transition-all"
              >
                <img
                  src={s.images?.[0]?.url || "/placeholder.png"}
                  alt={s.name?.[locale] || s.name}
                  className="w-10 h-10 object-contain rounded"
                />
                <span className="text-sm text-gray-800 dark:text-gray-100 truncate">
                  {s.name?.[locale] || s.name}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
