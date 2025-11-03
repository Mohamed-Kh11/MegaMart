"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import sony from "../../images/sony.webp";
import phone from "../../images/phone.webp";
import watch from "../../images/watch.webp";
import ps from "../../images/ps5.webp";

export default function Promo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef(null);
  const { theme, resolvedTheme } = useTheme();
  const t = useTranslations("promo");
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => setMounted(true), []);
  const currentTheme = mounted ? resolvedTheme || theme : "light";

  const productList = [
    { key: "ps5", img: ps, title: t("ps5.title"), description: t("ps5.description") },
    { key: "phone", img: phone, title: t("phone.title"), description: t("phone.description") },
    { key: "watch", img: watch, title: t("watch.title"), description: t("watch.description") },
  ];

  useEffect(() => {
    const start = () => {
      stop();
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % productList.length);
      }, 6000);
    };
    const stop = () => intervalRef.current && clearInterval(intervalRef.current);
    start();
    return stop;
  }, [productList.length]);

  const handleManualSelect = (index) => {
    intervalRef.current && clearInterval(intervalRef.current);
    setActiveIndex(index);
  };

  const handleBuyNow = () => router.push(`/${locale}/sony`);
  const activeProduct = productList[activeIndex];

  return (
    <section
      className={`w-full bg-amber-50 dark:bg-[#0b132d] min-h-[60svh] md:min-h-[70svh] py-8 px-8 sm:py-10 transition-colors duration-300 ${
        locale === "ar" ? "direction-rtl text-right" : "text-left"
      }`}
    >
      {/* Section Title */}
      <div className="relative text-center mb-10 flex items-center justify-center">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="mx-4 text-2xl md:text-3xl font-extrabold text-[#a28533] dark:text-amber-400">
          {t("promoTitle")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* Content Wrapper */}
      <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row items-center justify-evenly">
        {/* Left Section */}
        <div className="flex flex-col items-center gap-3 mb-6 lg:mb-0 text-center">
          <Image
            src={sony}
            alt="Sony"
            width={220}
            className="object-contain select-none sm:w-[260px]"
            priority
          />
          <p className="max-w-[90%] sm:max-w-[320px] text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("intro")}
          </p>

          <button
            onClick={handleBuyNow}
            className={`mt-3 px-5 py-2 text-sm sm:text-base font-semibold rounded-lg shadow-md transition-all bg-[#bb9b42] hover:bg-[#a28533] text-white`}
          >
            {t("buyNow")}
          </button>
        </div>

        {/* Active Product */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct.key}
              className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Image
                src={activeProduct.img}
                alt={activeProduct.title}
                className="max-w-full max-h-full object-contain"
              />
            </motion.div>
          </AnimatePresence>

          <motion.div
            key={activeProduct.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <h1 className="text-xl sm:text-2xl font-bold text-[#a28533] dark:text-amber-400 mb-1 sm:mb-2">
              {activeProduct.title}
            </h1>
            <p className="max-w-[90%] sm:max-w-[400px] text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed text-center">
              {activeProduct.description}
            </p>
          </motion.div>
        </div>

        {/* Thumbnails */}
        <div className="flex flex-row lg:flex-col justify-center items-center gap-4 sm:gap-6 mt-4 lg:mt-0">
          {productList.map((item, index) => (
            <div
              key={item.key}
              className={`w-16 h-16 sm:w-20 sm:h-20 p-1 sm:p-2 border-2 flex items-center justify-center cursor-pointer transition hover:scale-105 rounded-lg ${
                index === activeIndex
                  ? currentTheme === "dark"
                    ? "border-[#a28533]"
                    : "border-[#bb9b42]"
                  : "border-transparent"
              }`}
              onClick={() => handleManualSelect(index)}
            >
              <Image
                src={item.img}
                alt={item.title}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
