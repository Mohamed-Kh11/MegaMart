import { getTranslations } from "next-intl/server";
import Hero from "./components/hero";
import Promo from "./components/Promo";
import Features from "./components/Features";
import TrendyProducts from "./components/TrendyProducts";
import SpecialOffers from "./components/SpecialOffers";
import Charity from "./components/Charity";
import CookieConsent from "./components/CookieConsent";

export const metadata = {
  title: "Mega Mart – Everything in One Place",
  description:
    "Discover top-quality products, unbeatable deals, and everything you need — all in one place at Mega Mart.",
  alternates: {
    canonical: "https://www.megamart.com/",
  },
  openGraph: {
    title: "Mega Mart – Everything in One Place",
    description:
      "Shop electronics, beauty, fashion, groceries, and more — all at unbeatable prices.",
    url: "https://www.megamart.com/",
    siteName: "Mega Mart",
    images: [
      {
        url: "/linkImage.png",
        width: 1200,
        height: 630,
        alt: "Mega Mart – Online Shopping",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mega Mart – Everything in One Place",
    description:
      "Shop electronics, beauty, fashion, groceries, and more — all at unbeatable prices.",
    images: ["/linkImage.png"],
  },
};

export default async function Home() {
  const t = await getTranslations("home");

  return (
    <main className="relative">
      <Hero />
      <Features />
      <TrendyProducts />
      <SpecialOffers />
      <Promo />
      <Charity />
      <CookieConsent />
    </main>
  );
}
