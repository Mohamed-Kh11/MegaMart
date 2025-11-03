import { getTranslations } from "next-intl/server";
import ElectronicsClient from "./ElectronicsClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("electronicsMetaTitle", {
    defaultValue: "Electronics & Tech Gadgets | Mega Mart",
  });
  const description = t("electronicsMetaDescription", {
    defaultValue:
      "Shop the latest electronics, gadgets, and smart devices with unbeatable deals at Mega Mart.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-electronics.jpg"], // optional image
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-electronics.jpg"],
    },
  };
}

export default async function ElectronicsPage({ params }) {
  const { locale } = await params;
  return <ElectronicsClient locale={locale} />;
}
