"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { toast } from "react-hot-toast";
import Link from "next/link";
import api from "../lib/axios.js"; 

export default function SignInPage() {
  const t = useTranslations("signin");
  const locale = useLocale();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  1. Login — backend sets the cookie automatically
      await api.post(
        "/users/login",
        { email, password, rememberMe },
        { withCredentials: true }
      );

      // ✅ 2. Fetch user info using the JWT cookie
      const { data: user } = await api.get("/users/me", { withCredentials: true });

      // ✅ 3. Save minimal info in memory or sessionStorage (optional)
      sessionStorage.setItem("user", JSON.stringify(user));

      toast.success(t("success") || "Logged in successfully!");

      // ✅ 4. Redirect to home or dashboard
      setTimeout(() => {
        window.location.href = `/${locale}`;
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      toast.error(msg);
      console.error("❌ loginUser error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen pt-24 dark:bg-transparent px-4">
      <div className="w-full md:min-w-[500px] bg-MegaLight2 dark:bg-MegaDark2 p-8 rounded-2xl shadow-lg z-20">
        <h1 className="text-4xl font-bold text-center text-white mb-4">
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

          <div>
            <label className="block text-sm text-white mb-1">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/30 dark:bg-MegaDark text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="********"
              required
            />
          </div>


          <div className="flex items-center justify-between">
            <label className="flex items-center text-white text-sm">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="mr-2 accent-yellow-500"
              />
              {t("rememberMe")}
            </label>
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-white font-semibold py-2 rounded-lg shadow hover:bg-yellow-600 transition disabled:opacity-50"
          >
            {loading ? t("loading") : t("signin")}
          </button>
        </form>

        {/* Signup redirect */}
        <p className="text-center text-white/80 mt-6">
          {t("noAccount")}{" "}
          <Link
            href={`/${locale}/signup`}
            className="text-yellow-300 hover:underline font-semibold"
          >
            {t("signup")}
          </Link>
        </p>
      </div>
    </main>
  );
}
