"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const t = useTranslations("forgotPassword");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🧪 Mock API delay simulation
    setTimeout(() => {
      if (email.includes("@")) {
        toast.success(t("emailSent")); // pretend success
      } else {
        toast.error(t("error")); // pretend failure
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen pt-24 dark:bg-transparent px-4">
      <div className="w-full md:min-w-[500px] bg-MegaLight2 dark:bg-MegaDark2 p-8 rounded-2xl shadow-lg z-20">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          {t("title")}
        </h1>
        <p className="text-center text-white/80 mb-8">{t("subtitle")}</p>

        <form
          onSubmit={handleSubmit}
          className={`space-y-5 ${locale === "ar" ? "text-right" : "text-left"}`}
        >
          <div>
            <label className="block text-sm text-white mb-1">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/30 dark:bg-MegaDark text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="example@mail.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg shadow hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("sendLink")}
          </button>
        </form>

        <p className="text-center text-white/80 mt-6">
          <Link
            href={`/${locale}/signin`}
            className="text-yellow-300 hover:underline font-semibold"
          >
            {t("backToSignin")}
          </Link>
        </p>
      </div>
    </main>
  );
}
