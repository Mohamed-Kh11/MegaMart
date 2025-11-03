"use client";

import { useTranslations, useLocale } from "next-intl";
import { ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";

const Features = () => {
  const t = useTranslations("features");
  const locale = useLocale();

  const features = [
    { icon: <ShieldCheck size={36} />, text: t("quality") },
    { icon: <Truck size={36} />, text: t("shipping") },
    { icon: <RotateCcw size={36} />, text: t("return") },
    { icon: <Headphones size={36} />, text: t("support") },
  ];

  return (
    <section
      className={`w-full py-14 px-8 dark:bg-[#0b132d] transition-colors duration-300 ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-4 p-6 rounded-2xl shadow-md bg-white dark:bg-[#0e1839] border border-[#e7d9a8] dark:border-[#132254] hover:shadow-lg transition-all duration-300"
          >
            <div className="text-[#a28533] dark:text-amber-400">
              {feature.icon}
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
