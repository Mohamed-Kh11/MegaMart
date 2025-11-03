"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import charityImg from "../../images/charity3.png"; // update path as needed

export default function Charity() {
  const t = useTranslations("charity");
  const locale = useLocale();
  const router = useRouter();

  return (
    <section className="bg-amber-50 dark:bg-transparent px-6 py-12 md:px-12 lg:px-20 ">
      {/* Section title */}
      <div className="relative text-center mb-10 flex items-center justify-center">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="mx-4 text-3xl font-extrabold text-[#a28533] dark:text-amber-400">
          {t("title2")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* Charity content */}
      <div
        className={`flex flex-col md:flex-row items-center justify-center gap-8
        ${locale === "ar" ? "md:flex-row-reverse text-right" : "text-left"}`}
      >
        {/* Image */}
        <div className="w-full md:w-1/3">
          <Image
            src={charityImg}
            alt={t("title")}
            className="rounded-2xl object-cover w-full h-[200px] md:h-[300px]"
          />
        </div>

        {/* Text content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4">

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("description")}
          </p>
          <button
            onClick={() => router.push(`/${locale}/charity-details`)}
            className="self-start bg-MegaLight2 hover:bg-MegaLight  text-white font-semibold px-6 py-2 rounded-xl shadow-md transition-colors duration-200"
          >
            {t("button")}
          </button>
        </div>
      </div>
    </section>
  );
}
