import { getTranslations } from "next-intl/server";
import FashionClient from "./FashionClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("fashionMetaTitle", {
    defaultValue: "Fashion & Clothing | Mega Mart",
  });

  const description = t("fashionMetaDescription", {
    defaultValue:
      "Discover the latest fashion trends, stylish clothes, shoes, and accessories at Mega Mart.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-fashion.jpg"], // optional
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-fashion.jpg"],
    },
  };
}

export default async function FashionPage({ params }) {
  const { locale } = await params;
  return <FashionClient locale={locale} />;
}
