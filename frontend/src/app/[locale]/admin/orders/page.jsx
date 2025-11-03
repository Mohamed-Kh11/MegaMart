"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";
import api from "../../lib/axios.js";
import { toast } from "react-hot-toast";

export default function AdminOrdersPage() {
  const t = useTranslations("adminOrders");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // 🟢 Fetch all orders
  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (err) {
      console.error("❌ Fetch Orders Error:", err);
      toast.error(t("fetchError") || "Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🟢 Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      toast.success(t("statusUpdated") || "Status updated");
    } catch (err) {
      console.error("❌ Update Status Error:", err);
      toast.error(t("updateError") || "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[90svh]">
        <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );

  return (
    <section className="min-h-[90svh] px-6 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto bg-white dark:bg-MegaDark2 rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-10 py-8 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {locale === "en" ? "Customers Orders" : "طلبات العملاء"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("totalOrders") || "Total Orders"}: {orders.length}
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="py-16 text-center text-gray-500 dark:text-gray-400">
            {t("noOrders") || "No orders found."}
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order) => (
              <div
                key={order._id}
                className="px-10 py-8 :bg-MegaDark transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      #{order._id.slice(-6)}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleString(locale)}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingId === order._id}
                      className={`border rounded-lg px-3 py-2 text-sm font-medium ${
                        updatingId === order._id
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      } dark:bg-MegaDark2 dark:border-gray-600 dark:text-gray-100`}
                    >
                      <option value="Pending">{t("pending")}</option>
                      <option value="Preparing">{t("preparing")}</option>
                      <option value="Shipped">{t("shipped")}</option>
                      <option value="Delivered">{t("delivered")}</option>
                      <option value="Cancelled">{t("cancelled")}</option>
                    </select>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Customer" : "العميل"}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.userId?.name || "—"}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {order.userId?.email || ""}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Phone" : "الهاتف"}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.phone || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {locale === "en" ? "Payment Method" : "طريقة الدفع"}
                    </p>
                    <p className="text-gray-900 dark:text-gray-100">
                      {order.method}
                    </p>
                  </div>
                </div>

                {/* Address */}
                {order.address && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                      {locale === "en" ? "Shipping Address" : "عنوان الشحن"}
                    </h3>
                    <div className="text-sm text-gray-900 dark:text-gray-200 space-y-1">
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state}
                      </p>
                      <p>
                        {order.address.country} — {order.address.postalCode}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
                    {locale === "en" ? "Ordered Items" : "المنتجات المطلوبة"}
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border rounded-lg px-4 py-2 dark:border-gray-600"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {typeof item.name === "object"
                              ? item.name[locale] || item.name.en
                              : item.name}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            x{item.quantity}
                          </p>
                                                  <p className="font-semibold text-gray-800 dark:text-gray-200 p-2">
                          LE{item.price.toFixed(2)}
                        </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="mt-6 text-right">
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {locale === "en" ? "Total:" : "الإجمالي:"} {order.total.toFixed(2)}  LE 

                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
