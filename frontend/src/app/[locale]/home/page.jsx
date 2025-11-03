import { getTranslations } from "next-intl/server";
import HomeAppliancesClient from "./HomeAppliancesClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("homeAppliancesMetaTitle", {
    defaultValue: "Home Appliances & Kitchen Essentials | Mega Mart",
  });

  const description = t("homeAppliancesMetaDescription", {
    defaultValue:
      "Discover the latest home appliances and kitchen essentials including washing machines, fridges, ovens, and more at Mega Mart. High quality at great prices.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-home-appliances.jpg"], // optional
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-home-appliances.jpg"],
    },
  };
}

export default async function HomeAppliancesPage({ params }) {
  const { locale } = await params;
  return <HomeAppliancesClient locale={locale} />;
}
