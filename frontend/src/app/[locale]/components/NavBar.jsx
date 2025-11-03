"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { PiSignOut } from "react-icons/pi";
import { useTheme } from "next-themes";
import { Sun, Moon, User, ShoppingCart } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../../images/bag.png";
import MobileNavDrawer from "./MobileNavDrawer";
import SearchBar from "./SearchBar";
import api from "../lib/axios.js";

export default function NavBar() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const links = [
    { href: `/${locale}/mobiles`, label: t("mobiles") },
    { href: `/${locale}/fashion`, label: t("fashion") },
    { href: `/${locale}/electronics`, label: t("electronics") },
    { href: `/${locale}/beauty`, label: t("beauty") },
    { href: `/${locale}/groceries`, label: t("groceries") },
    { href: `/${locale}/home`, label: t("homeAppliances") },
    { href: `/${locale}/todaysDeal`, label: t("Today's Deal") },
  ];

  // ✅ Fetch logged-in user via JWT cookie
  useEffect(() => {
    setMounted(true);
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/users/me", { withCredentials: true });
        setCurrentUser(data);
      } catch (err) {
        setCurrentUser(null); // not logged in
      }
    };
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      await api.post("/users/logout", {}, { withCredentials: true }); // backend clears cookie
      setCurrentUser(null);
      window.location.href = `/${locale}`;
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ✅ Fetch cart count (JWT-protected if logged in)
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        let count = 0;

        if (currentUser?._id) {
          const { data } = await api.get("/users/me", { withCredentials: true });
          const userCart = Array.isArray(data.cart) ? data.cart : [];
          count = userCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        } else {
          const localCart = JSON.parse(localStorage.getItem("cart")) || [];
          count = localCart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        }

        setCartCount(count);
      } catch (err) {
        console.error("❌ Error updating cart count:", err);
      }
    };

    updateCartCount();

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);

    const refreshTimer = setTimeout(updateCartCount, 2000);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
      clearTimeout(refreshTimer);
    };
  }, [currentUser]);

  if (!mounted) return null;

  return (
    <header
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="fixed w-full z-50 bg-[#bb9b42] dark:bg-[#0b1639] backdrop-blur-2xl shadow-lg dark:shadow-xl"
    >
      <div className="flex items-center justify-between px-4 md:px-10 py-4">
        {/* Left section: burger + logo */}
        <div className="flex items-center gap-3">
          <MobileNavDrawer links={links} />
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <Image src={logo} alt="Logo" priority width={42} height={42} className="brightness-[98%]" />
            <span className="text-white font-bold text-2xl md:text-3xl tracking-wide font-[Amaranth]">
              Mega Mart
            </span>
          </Link>
        </div>

        {/* Desktop Search */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-6">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher variant="pill" />
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="hidden sm:flex p-2 rounded-full hover:bg-white/20 transition"
          >
            {theme === "dark" ? (
              <Moon size={22} className="text-white" />
            ) : (
              <Sun size={22} className="text-white" />
            )}
          </button>

          {/* Cart */}
          <Link
            href={`/${locale}/cart`}
            className="relative flex p-2 rounded-full hover:bg-white/20 transition"
            aria-label="Cart"
          >
            <ShoppingCart size={22} className="text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full px-[5px] py-[1px] min-w-[16px] text-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                className="flex items-center hover:bg-white/20 rounded-md py-1"
                href={`/${locale}/profile/${currentUser._id}`}
              >
                <User size={22} className="text-white" />
                <span className="text-white hidden sm:block text-xs truncate max-w-[80px] text-center text-wrap">
                  {currentUser.name}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white text-sm bg-MegaLight2 px-3 py-1 rounded-md hover:bg-red-700 transition"
                title={locale === "en" ? "Sign out" : "تسجيل خروج"}
              >
                <PiSignOut className="text-lg h-7" />
              </button>
            </div>
          ) : (
            <Link
              href={`/${locale}/signin`}
              aria-label="Sign in"
              className="hidden sm:flex p-2 rounded-full hover:bg-white/20 transition"
              title={locale === "en" ? "Sign in" : "تسجيل دخول"}
            >
              <User size={22} className="text-white" />
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search */}
      <div className="block lg:hidden px-4 pb-3">
        <SearchBar />
      </div>

      {/* Divider */}
      <div className="hidden md:block w-[95%] mx-auto h-[1px] bg-white/15"></div>

      {/* Category Links */}
      <div className="hidden text-xs sm:flex justify-center flex-wrap gap-6 md:gap-10 py-[9px] md:text-sm font-medium text-white">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline hover:opacity-90 transition">
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
