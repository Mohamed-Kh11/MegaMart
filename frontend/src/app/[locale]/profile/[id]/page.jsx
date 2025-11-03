"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";
import Spinner from "../../components/Spinner";
import {
  User,
  MapPin,
  Edit3,
  Save,
  X,
  PackageSearch,
  LayoutDashboard,
} from "lucide-react";

export default function PersonalInfoPage() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", country: "", postalCode: "" },
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            country: data.address?.country || "",
            postalCode: data.address?.postalCode || "",
          },
        });
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push(`/${locale}/signin`);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [locale, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await api.put("/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data.user);
      setEditing(false);
    } catch (err) {
      console.error("❌ Update error:", err);
      alert(t("updateError") || "Error updating info");
    }
  };

  if (!mounted || loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  if (!user)
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-20">
        {t("noUserFound") || "No user found"}
      </div>
    );

  const inputClass =
    "w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b132d] text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#bb9b42] outline-none";

  return (
    <section className="min-h-[90svh] py-12 px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {locale === "en" ? "My Account" : "حسابي"}
          </h1>

          <div className="flex flex-wrap gap-3">
            {/* ✅ Admin Buttons */}
            {user.role === "admin" && (
              <>
                <button
                  onClick={() => router.push(`/${locale}/admin/products`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#bb9b42] text-white hover:bg-[#a28533] transition"
                >
                  <LayoutDashboard size={18} />
                  {locale === "en" ? "Control Panel" : "لوحة التحكم"}
                </button>
                <button
                  onClick={() => router.push(`/${locale}/admin/orders`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#bb9b42] text-white hover:bg-[#a28533] transition"
                >
                  <PackageSearch size={18} />
                  {locale === "en" ? "Orders" : "الطلبات"}
                </button>
              </>
            )}

            {/* ✅ My Orders Button */}
            <button
              onClick={() => router.push(`/${locale}/profile/${user._id}/orders`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#bb9b42] text-[#bb9b42] dark:text-white font-medium hover:bg-[#bb9b42] hover:text-white transition"
            >
              <PackageSearch size={18} />
              {locale === "en" ? "My Orders" : "طلباتي"}
            </button>

            {/* ✅ Edit / Cancel Button */}
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#bb9b42] text-[#bb9b42] dark:text-white font-medium hover:bg-[#bb9b42] hover:text-white transition"
            >
              {editing ? <X size={18} /> : <Edit3 size={18} />}
              {editing
                ? locale === "en"
                  ? "Cancel"
                  : "إلغاء"
                : locale === "en"
                  ? "Edit"
                  : "تعديل"}
            </button>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Profile Info */}
          <div className="bg-white dark:bg-MegaDark2 rounded-2xl shadow-md p-8 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <User size={20} />{" "}
              {locale === "en" ? "Profile" : "الملف الشخصي"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">{t("name") || "Name"}</p>
                {editing ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={t("enterName") || "Enter name"}
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                    {user.name}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500">{t("email") || "Email"}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                  {user.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">{t("phone") || "Phone"}</p>
                {editing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass}
                    placeholder={t("enterPhone") || "Enter phone number"}
                  />
                ) : (
                  <p className="font-medium text-gray-900 dark:text-gray-100 break-words">
                    {user.phone || "-"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Info */}
          <div className="bg-white dark:bg-MegaDark2 rounded-2xl shadow-md p-8 space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
              <MapPin size={20} /> {locale === "en" ? "Address" : "العنوان"}
            </h2>

            <div className="grid sm:grid-cols-2 gap-6">
              {Object.entries(formData.address).map(([key, value]) => (
                <div key={key}>
                  <p className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  {editing ? (
                    <input
                      name={`address.${key}`}
                      value={value}
                      onChange={handleChange}
                      placeholder={`${t("enter")} ${t(key) || key}`}
                      className={inputClass}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-100 font-medium break-words">
                      {user.address?.[key] || "-"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        {editing && (
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-8 py-3 rounded-lg bg-[#bb9b42] text-white font-semibold hover:bg-[#a28533] transition"
            >
              <Save size={18} />
              {locale === "en" ? "Save Changes" : "حفظ التغييرات"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
