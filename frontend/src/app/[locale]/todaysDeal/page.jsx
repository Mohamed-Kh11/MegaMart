import { getTranslations } from "next-intl/server";
import TodaysDealClient from "./TodaysDealClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title =
    t("todaysDealMetaTitle") ||
    "Today's Deals & Discounts | Mega Mart";

  const description =
    t("todaysDealMetaDescription") ||
    "Shop the hottest deals and biggest discounts of the day at Mega Mart. Limited-time offers on electronics, fashion, appliances, and more!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-todays-deal.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-todays-deal.jpg"],
    },
  };
}

export default async function TodaysDealPage({ params }) {
  const { locale } = await params;
  return <TodaysDealClient locale={locale} />;
}
