"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-hot-toast";
import charityClothes from "../../images/charity2.png"; // adjust path if needed

export default function CharityDetails() {
  const t = useTranslations("charity");
  const locale = useLocale();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    date: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      toast.error(t("fillAllFields"));
      return;
    }

    setSubmitting(true);
    try {
      // In real case: await api.post("/charity", formData);
      console.log("📦 Donation Request:", formData);
      toast.success(t("pickupBooked"));
      setFormData({
        name: "",
        phone: "",
        address: "",
        city: "",
        date: "",
        notes: "",
      });
    } catch (err) {
      console.error("❌ Charity form error:", err);
      toast.error(t("error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className={`min-h-[90vh] px-6 py-14 md:px-12 lg:px-20 bg-amber-50 dark:bg-transparent ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* --- Header --- */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#a28533] dark:text-amber-400 mb-3">
          {t("clothDonationTitle")}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          {t("clothDonationSubtitle")}
        </p>
      </div>

      {/* --- Content --- */}
      <div
        className={`flex flex-col md:flex-row items-center justify-center gap-10 mb-16 ${
          locale === "ar" ? "md:flex-row-reverse" : ""
        }`}
      >
        {/* Image */}
        <div className="w-full md:w-1/2">
          <Image
            src={charityClothes}
            alt={t("clothDonationTitle")}
            className="rounded-2xl object-cover w-full h-[280px] md:h-[380px] "
          />
        </div>

        {/* Text info */}
        <div className="w-full md:w-1/2 space-y-4 text-gray-700 dark:text-gray-300">
          <h3 className="text-2xl font-bold text-MegaLight2 dark:text-amber-400">
            {t("whatToDonate")}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("cleanClothes")}</li>
            <li>{t("lightlyUsedShoes")}</li>
            <li>{t("blankets")}</li>
            <li>{t("childrenClothes")}</li>
            <li>{t("accessories")}</li>
          </ul>

          <h3 className="text-2xl font-bold mt-6 text-MegaLight2 dark:text-amber-400">
            {t("whatNotToDonate")}
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t("tornItems")}</li>
            <li>{t("dirtyOrWet")}</li>
            <li>{t("underwear")}</li>
            <li>{t("nonWashableItems")}</li>
          </ul>
        </div>
      </div>

      {/* --- Pickup Form --- */}
      <div className="bg-white dark:bg-MegaDark2 rounded-2xl shadow-md p-8 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold text-[#a28533] dark:text-amber-400 mb-6 text-center">
          {t("pickupFormTitle")}
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("name")}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#1e2a56] text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("phone")}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#1e2a56] text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("address")}
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#1e2a56] text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("city")}
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#1e2a56] text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Date */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("preferredDate")}
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#1e2a56] text-gray-800 dark:text-gray-100"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              {t("notes")}
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-[#1e2a56] text-gray-800 dark:text-gray-100"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-[#a28533] text-white font-semibold rounded-xl shadow hover:bg-[#8e7328] transition disabled:opacity-50"
            >
              {submitting ? t("sending") + "..." : t("bookPickup")}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
