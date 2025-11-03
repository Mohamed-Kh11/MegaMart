import { getTranslations } from "next-intl/server";
import Under100Client from "./Under100Client.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("under100MetaTitle", {
    defaultValue: "Under 100 LE | Mega Mart",
  });

  const description = t("under100MetaDescription", {
    defaultValue:
      "Shop budget-friendly products under 100 LE at Mega Mart. Great value deals with top quality — affordable for everyone!",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website", // ✅ valid OG type
      images: ["/og-under100.jpg"], // optional placeholder image
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-under100.jpg"],
    },
  };
}

export default async function Under100Page({ params }) {
  const { locale } = await params;
  return <Under100Client locale={locale} />;
}
