"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "../../images/bag.png";

export default function Footer() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid rendering until mounted (prevents hydration mismatch flash)
  if (!mounted) return null;

  const currentTheme = resolvedTheme;

  const links = [
    { href: `/${locale}/mobiles`, label: t("mobiles") },
    { href: `/${locale}/fashion`, label: t("fashion") },
    { href: `/${locale}/electronics`, label: t("electronics") },
    { href: `/${locale}/beauty`, label: t("beauty") },
    { href: `/${locale}/groceries`, label: t("groceries") },
    { href: `/${locale}/home`, label: t("homeAppliances") },
    { href: `/${locale}/todaysDeal`, label: t("Today's Deal") },
  ];

  return (
    <footer
      className={`w-full backdrop-blur-2xl duration-300 pt-12 
      ${currentTheme === "dark" ? "bg-[#0f1a3d]" : "bg-[#bb9b42]"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        {/* Left section */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-3">
            <Image src={logo} alt="Logo" width={50} height={50} className="brightness-[98%]" />
            <h2 className="text-white text-3xl font-bold font-[Amaranth] tracking-wide">
              Mega Mart
            </h2>
          </div>
          <p className="text-white/90 text-sm leading-relaxed max-w-sm">
            {locale === "en"
              ? "Your one-stop shop for quality products at the best prices. Fast delivery and amazing deals every day!"
              : "متجرك الشامل لأفضل المنتجات بأسعار مميزة. توصيل سريع وعروض مذهلة كل يوم!"}
          </p>

          <div className="flex flex-col gap-2 text-white/90 text-sm mt-4">
            <p className="flex items-center gap-2"><Mail size={16} /> support@megamart.com</p>
            <p className="flex items-center gap-2"><Phone size={16} /> +1 (234) 567-890</p>
            <p className="flex items-center gap-2"><MapPin size={16} /> Cairo, Egypt</p>
          </div>
        </div>

        {/* Center Links */}
        <div className="flex flex-col md:items-center gap-6">
          <h3 className="text-white text-lg font-semibold">
            {locale === "en" ? "Quick Links" : "روابط سريعة"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-white/90 hover:text-white transition">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-start md:items-end gap-5">
          <h3 className="text-white text-lg font-semibold">
            {locale === "en" ? "Follow Us" : "تابعنا"}
          </h3>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="hover:scale-110 transition">
                <Icon size={22} className="text-white" />
              </a>
            ))}
          </div>

          <button
            className={`mt-4 px-5 py-2 rounded-md text-sm font-medium transition
            ${currentTheme === "dark"
                ? "bg-MegaDark2 text-white hover:bg-[#0e1837]"
                : "bg-MegaLight2 text-white hover:bg-[#af9038]"}`}
          >
            {locale === "en"
              ? "Subscribe to Newsletter"
              : "اشترك في النشرة البريدية"}
          </button>
        </div>
      </div>

      <div
        className={`mt-12 py-4 text-center text-xs tracking-wide 
        ${currentTheme === "dark" ? "bg-[#0b132d]" : "bg-[#a28533]"} text-white`}
      >
        © {new Date().getFullYear()} Mega Mart —{" "}
        {locale === "en" ? "All rights reserved" : "جميع الحقوق محفوظة"}
      </div>
    </footer>
  );
}
