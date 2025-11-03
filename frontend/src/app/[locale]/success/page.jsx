"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const t = useTranslations("success");
  const locale = useLocale();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("lastOrder");
    if (saved) {
      setOrder(JSON.parse(saved));
      setLoading(false);
    } else {
      router.push(`/${locale}/cart`);
    }
  }, [router, locale]);

  const handleContinue = () => {
    localStorage.removeItem("lastOrder");
    router.push(`/${locale}`);
  };

  if (loading)
    return (
      <div className="w-full py-20 text-center text-gray-500 dark:text-gray-300">
        {t("loading") || "Loading receipt..."}
      </div>
    );

  const { items, total, method, address, phone } = order || {};

  return (
    <section className="px-4 py-20 sm:py-24 lg:py-20 sm:px-6 md:px-8 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-MegaDark2 rounded-2xl p-4 sm:p-8 shadow-md text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#a28533] dark:text-amber-400 mb-3">
          {t("thankYou") || "Thank you for your purchase!"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          {t("confirmation") || "Your order has been successfully placed."}
        </p>

        {/* ✅ Order items */}
        <div className="space-y-3 text-left max-h-[50vh] overflow-y-auto overflow-x-hidden pr-1">
          {items?.map((item, index) => (
            <div
              key={item._id || `${item.name}-${index}`}
              className="grid grid-cols-[auto_1fr_auto] sm:flex sm:flex-nowrap items-center justify-between gap-2 sm:gap-3 bg-gray-50 dark:bg-MegaDark rounded-lg p-3"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 col-span-2 sm:col-span-auto">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name?.[locale] || item.name}
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate">
                    {item.name?.[locale] || item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.quantity} × {item.price} LE
                  </p>
                </div>
              </div>
              <p className="font-semibold text-sm whitespace-nowrap justify-self-end">
                {(item.price * item.quantity).toFixed(2)} LE
              </p>
            </div>
          ))}
        </div>

        {/* ✅ Order summary */}
        <div className="mt-4 sm:mt-6 border-t border-gray-200 dark:border-MegaDark2 pt-4 text-right">
          <p className="text-base sm:text-lg font-semibold">
            {t("total") || "Total"}:{" "}
            <span className="text-[#a28533] dark:text-amber-400">
              {total?.toFixed(2)} LE
            </span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("paymentMethod") || "Payment method"}:{" "}
            <span className="font-medium">{method}</span>
          </p>

          {/* ✅ Address & phone info */}
          {(address || phone) && (
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-3 text-center ">
              <h4 className="font-semibold mb-1">
                {t("shippingDetails") || "Shipping Details"}
              </h4>
              {address && (
                <p>
                  {(address.street ? address.street + ", " : "")}
                  {address.city && address.city + ", "}
                  {address.state && address.state + ", "}
                  {address.country && address.country + " "}
                  {address.postalCode && "(" + address.postalCode + ")"}
                </p>
              )}
              {phone && <p>{t("phone") || "Phone"}: {phone}</p>}
            </div>
          )}
        </div>

        {/* ✅ Continue button */}
        <button
          onClick={handleContinue}
          className="mt-8 w-full px-6 py-3 rounded-lg bg-[#a28533] text-white font-semibold hover:bg-[#8e7328] transition text-sm sm:text-base"
        >
          {t("continueShopping") || "Continue Shopping"}
        </button>
      </div>
    </section>
  );
}
