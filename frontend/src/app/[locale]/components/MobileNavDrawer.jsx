"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ShoppingCart,
  User,
  Moon,
  Sun,
  Menu,
  X,
  Globe,
} from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import SearchBar from "./SearchBar";
import api from "../lib/axios.js";
import logo from "../../images/bag.png";

export default function MobileNavDrawer({ links }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const drawerRef = useRef(null);
  const { theme, setTheme } = useTheme();
  const t = useTranslations("home");
  const locale = useLocale();
  const router = useRouter();

  const isArabic = locale === "ar";
  const slideDirection = isArabic ? "translate-x-full" : "-translate-x-full";
  const alignSide = isArabic ? "right-0" : "left-0";

  // ✅ Mount & fetch user using HttpOnly cookie
  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me", { withCredentials: true });
        setCurrentUser(data);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  // ✅ Fetch cart count (syncs with NavBar)
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        let count = 0;

        if (currentUser?._id) {
          // Logged-in user → fetch cart via cookie-protected route
          const { data } = await api.get("/users/me", { withCredentials: true });
          const userCart = Array.isArray(data.cart) ? data.cart : [];
          count = userCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        } else {
          // Guest → use localStorage
          const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          count = localCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }

        setCartCount(count);
      } catch (err) {
        console.error("❌ Cart count error:", err);
      }
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, [currentUser]);

  // ✅ Handle outside clicks
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  // ✅ Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const closeDrawer = () => setOpen(false);

  // ✅ Sign out via backend (clears cookie)
  const handleSignOut = async () => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true });
      setCurrentUser(null);
      router.push(`/${locale}`);
      closeDrawer();
    } catch (err) {
      console.error("❌ Logout failed:", err);
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label={t("menu")}
        className="sm:hidden text-white p-2 rounded-full hover:bg-white/20 transition"
      >
        <Menu size={26} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={closeDrawer}
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 ${alignSide} w-4/5 max-w-sm h-[100dvh] bg-[#bb9b42] dark:bg-[#111d44] z-50 transform ${
          open ? "translate-x-0" : slideDirection
        } transition-transform duration-300 ease-in-out flex flex-col`}
      >
        {/* Scrollable inner area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/20 sticky top-0 bg-[#bb9b42] dark:bg-[#111d44] z-10">
            <div className="flex items-center gap-2">
              <Image src={logo} alt="Logo" width={35} height={35} priority />
              <span className="text-white font-bold text-xl font-[Amaranth]">
                Mega Mart
              </span>
            </div>
            <button onClick={closeDrawer} className="text-white">
              <X size={24} />
            </button>
          </div>

          {/* Search bar */}


          {/* Links */}
          <nav className="flex flex-col my-5 px-6 space-y-4 text-white text-base">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeDrawer}
                className="hover:underline hover:opacity-90 transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-white/20 px-6 py-6 flex flex-col items-start space-y-5 text-white">
            {/* Theme Toggle */}
            <button
              onClick={() => {
                setTheme(theme === "dark" ? "light" : "dark");
                closeDrawer();
              }}
              className="flex items-center gap-3 hover:opacity-90 transition"
            >
              {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
              <span>{theme === "dark" ? t("darkMode") : t("lightMode")}</span>
            </button>

            {/* Language */}
            <div onClick={closeDrawer} className="flex items-center gap-3">
              <Globe size={20} />
              <LanguageSwitcher variant="pill" />
            </div>

            {/* Cart */}
            <button
              onClick={() => {
                router.push(`/${locale}/cart`);
                closeDrawer();
              }}
              className="relative flex items-center gap-3 hover:opacity-90 transition"
            >
              <ShoppingCart size={20} />
              <span>{t("cart")}</span>
              {cartCount > 0 && (
                <span className="absolute left-4 -top-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-[6px] py-[1px]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                <User size={22} />
                <div className="flex flex-col bg-white/20 p-2 rounded-md">
                  <Link
                    href={`/${locale}/profile/${currentUser._id}`}
                    onClick={closeDrawer}
                    className="text-sm font-semibold hover:underline"
                  >
                    {currentUser.name}
                  </Link>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-xs bg-red-600 p-2 rounded-md text-white hover:bg-red-700"
                >
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  router.push(`/${locale}/signin`);
                  closeDrawer();
                }}
                className="flex items-center gap-3 hover:opacity-90 transition"
              >
                <User size={20} />
                <span>{t("signIn")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
