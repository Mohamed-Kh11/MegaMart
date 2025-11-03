import { getTranslations } from "next-intl/server";
import FlashSaleClient from "./FlashSaleClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("flashSaleMetaTitle", {
    defaultValue: "Flash Sale | Mega Mart",
  });

  const description = t("flashSaleMetaDescription", {
    defaultValue:
      "Grab amazing discounts during Mega Mart's Flash Sale! Limited-time offers on top products — hurry up before it ends!",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website", // ✅ valid OG type
      images: ["/og-flash-sale.jpg"], // optional
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-flash-sale.jpg"],
    },
  };
}

export default async function FlashSalePage({ params }) {
  const { locale } = await params;
  return <FlashSaleClient locale={locale} />;
}
