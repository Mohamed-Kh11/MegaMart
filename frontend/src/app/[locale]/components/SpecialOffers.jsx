"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

// Images
import flashImg from "../../images/flash.png";
import cheapImg from "../../images/100.jpg";

const SpecialOffers = () => {
  const t = useTranslations("offers");
  const locale = useLocale();
  const router = useRouter();

  const offers = [
    {
      id: 1,
      title: t("flash.title"),
      desc: t("flash.desc"),
      img: flashImg,
      btn: t("flash.button"),
      link: `/${locale}/flash`,
      bgClass: "bg-MegaLight dark:bg-MegaDark",
    },
    {
      id: 2,
      title: t("cheap.title"),
      desc: t("cheap.desc"),
      img: cheapImg,
      btn: t("cheap.button"),
      link: `/${locale}/under100`,
      bgClass: "bg-MegaLight dark:bg-MegaDark",
    },
  ];

  return (
    <section
      className={`w-full py-14 px-8 bg-amber-50 dark:bg-[#0b132d] transition-colors duration-300 ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* Section Title */}
      <div className="relative text-center mb-10 flex items-center justify-center">
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
        <h2 className="mx-4 text-3xl font-extrabold text-[#a28533] dark:text-amber-400">
          {t("title")}
        </h2>
        <div className="flex-1 max-w-[100px] h-[2px] bg-[#a28533] dark:bg-amber-400 rounded-full"></div>
      </div>

      {/* Offers Grid */}
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`${offer.bgClass} text-white rounded-2xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md hover:shadow-lg transition-all duration-300`}
          >
            {/* Text Section */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-3">{offer.title}</h3>
              <p className="text-sm mb-5 leading-relaxed">{offer.desc}</p>
              <button
                onClick={() => router.push(offer.link)}
                className="px-5 py-2 text-sm font-medium rounded-lg bg-white hover:bg-gray-200 text-MegaLight2 dark:bg-[#bb9b42] dark:hover:bg-[#a28533] dark:text-white  transition-all duration-200"
              >
                {offer.btn}
              </button>
            </div>

            {/* Image Section */}
            <div className="flex-1 relative w-40 h-40 lg:w-56 lg:h-56">
              <Image
                src={offer.img}
                alt={offer.title}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;
