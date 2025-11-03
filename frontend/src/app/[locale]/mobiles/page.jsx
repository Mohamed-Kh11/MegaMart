// app/[locale]/mobiles/page.jsx
import { getTranslations } from "next-intl/server";
import MobilesClient from "./MobilesClient.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "categories" });

  const title = t("mobilesMetaTitle", { defaultValue: "Mobiles | Mega Mart" });
  const description = t("mobilesMetaDescription", {
    defaultValue: "Browse the latest smartphones and mobile devices at Mega Mart.",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: ["/og-mobiles.jpg"], // optional custom image
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-mobiles.jpg"],
    },
  };
}

export default async function MobilesPage({ params }) {
  const { locale } = await params;

  return <MobilesClient locale={locale} />;
}
