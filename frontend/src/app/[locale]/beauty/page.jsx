// app/[locale]/beauty/page.jsx
import { getTranslations } from "next-intl/server";
import BeautyClient from "./BeautyClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("beautyMetaTitle", { defaultValue: "Beauty Products | Mega Mart" });
  const description = t("beautyMetaDescription", {
    defaultValue:
      "Discover premium beauty, skincare, makeup, and personal care products at Mega Mart.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-beauty.jpg"], 
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-beauty.jpg"],
    },
  };
}

export default async function BeautyPage({ params }) {
  const { locale } = await params;
  return <BeautyClient locale={locale} />;
}
