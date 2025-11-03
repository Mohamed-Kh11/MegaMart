import { getTranslations } from "next-intl/server";
import GroceriesClient from "./GroceriesClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("groceriesMetaTitle", {
    defaultValue: "Groceries & Food Products | Mega Mart",
  });

  const description = t("groceriesMetaDescription", {
    defaultValue:
      "Shop daily groceries, fresh food, drinks, and essential kitchen items at Mega Mart. Quality products at unbeatable prices.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-groceries.jpg"], // optional OG image
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-groceries.jpg"],
    },
  };
}

export default async function GroceriesPage({ params }) {
  const { locale } = await params;
  return <GroceriesClient locale={locale} />;
}
