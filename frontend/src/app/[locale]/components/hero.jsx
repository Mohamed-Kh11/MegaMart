"use client";

import Image from "next/image";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import shop from "../../images/nike2.webp";
import shop2 from "../../images/sale.png";
import shop3 from "../../images/samsung.png";
import shop4 from "../../images/toshiba.jpg";
import shop5 from "../../images/iPhone17.webp";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./fixSlickRTL.css";
import Link from "next/link";


const Hero = () => {
  const t = useTranslations("home");
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  // ✅ Ensure the slider mounts *after* the DOM direction is stable
  useEffect(() => {
    setMounted(true);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: true,
    rtl: false,
    fade: true,
  };

  const images = [shop, shop2, shop3, shop4, shop5];

  return (
    <section className="relative w-full pt-[115px] sm:pt-[150px] dark:bg-[#0b1639] lg:pt-[115px] min-h-[100svh] flex items-center">
      {/* <div className="absolute -right-52 z-10 w-full h-full" >
        <Image src={background} className="w-full h-full object-cover" alt="background" />
      </div> */}
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-center px-6 py-12 gap-12 z-20">
        {/* Left */}
        <div className="flex flex-col items-center gap-6 text-center lg:text-left max-w-xl w-full">
          <h1
            className={`text-4xl lg:text-[42px] font-extrabold text-gray-900 dark:text-white ${locale === "ar" ? "leading-[1.4] lg:leading-[1.5]" : "leading-tight"
              }`}
          >
            {t("welcome")}{" "}
            <span className="text-MegaLight dark:text-amber-400">{t("megaMart")}</span>
          </h1>

          <p className="hidden lg:block text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            {t("description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link href={`/${locale}/products`} className="px-8 py-3 text-lg bg-MegaLight hover:bg-[#8e7328] text-white rounded-xl shadow-md transition-all duration-200  ">
              {t("shopNow")}
            </Link>
          </div>
        </div>

        {/* Right Carousel */}
        <div dir="ltr" className="relative w-full lg:max-w-[680px] xl:max-w-[720px]">
          {mounted && (
            <Slider {...settings}>
              {images.map((img, index) => (
                <div key={index} className="relative w-full h-[320px] sm:h-[400px] lg:h-[480px] rounded-3xl overflow-hidden ">
                    <Image
                      src={img}
                      alt={`Slide ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
