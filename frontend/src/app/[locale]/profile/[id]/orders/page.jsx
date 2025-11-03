"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import api from "../../../lib/axios.js";

export default function OrdersPage() {
  const t = useTranslations("orders");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?._id) return;

        const { data } = await api.get(`/users/${storedUser._id}`);
        setUser(data);
      } catch (error) {
        console.error("❌ Error fetching user orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (!mounted || loading)
    return (
      <div className="flex justify-center items-center h-[90svh] text-gray-600 dark:text-gray-300">
        {t("loading")}
      </div>
    );

  if (!user || !Array.isArray(user.orders) || user.orders.length === 0)
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        {t("noOrders")}
      </div>
    );

  return (
    <section className="min-h-[90svh] transition-colors duration-300">
      <div className="min-w-[350px] md:min-w-[500px] lg:min-w-[800px] max-w-6xl mx-auto bg-white dark:bg-MegaDark2 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-MegaLight dark:text-white mb-4">
            {t("title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Orders list */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {user.orders.map((order) => (
            <div
              key={order._id}
              className="p-8 hover:bg-gray-50 dark:hover:bg-[#0b132d] transition-colors"
            >
              {/* Order header */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t("orderId")}:{" "}
                    <span className="text-[#bb9b42]">{order._id}</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleString(locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : order.status === "Cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {t(order.status.toLowerCase())}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">
                    {order.method}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-[#111b3d] rounded-2xl shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name?.[locale] || item.name?.en}
                      className="w-20 h-20 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {item.name?.[locale] || item.name?.en}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        × {item.quantity}
                      </p>
                      <p className="text-[#bb9b42] font-semibold">
                        {item.price.toLocaleString(locale)} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary + address */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {t("shippingAddress")}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {[order.address.street, order.address.city, order.address.state, order.address.country]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t("phone")}: {order.phone}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t("total")}
                  </p>
                  <p className="text-2xl font-bold text-[#bb9b42]">
                    {order.total.toLocaleString(locale)} EGP
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
