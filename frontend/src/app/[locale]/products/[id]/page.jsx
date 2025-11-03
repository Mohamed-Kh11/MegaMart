import { getTranslations } from "next-intl/server";
import api from "../../lib/axios.js";
import ProductClient from "./ProductClient.jsx";

export async function generateMetadata({ params }) {
  const { id, locale } = await params;

  try {
    const { data: product } = await api.get(`/products/${id}`);
    const t = await getTranslations({ locale, namespace: "productDetails" });

    const name = product?.name?.[locale] || product?.name?.en || "Product";
    const description =
      product?.description?.[locale] ||
      t("metaDescriptionDefault", { name });

    return {
      title: `${name} | Mega Mart`,
      description,
      openGraph: {
        title: `${name} | Mega Mart`,
        description,
        images: product?.images?.[0]?.url
          ? [product.images[0].url]
          : ["/placeholder.png"],
        locale,
        type: "website", // ✅ fixed
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} | Mega Mart`,
        description,
        images: product?.images?.[0]?.url
          ? [product.images[0].url]
          : ["/placeholder.png"],
      },
    };

  } catch (error) {
    return {
      title: "Product Not Found | Mega Mart",
      description: "This product may not exist or has been removed.",
    };
  }
}

export default async function ProductDetailsPage({ params }) {
  const { id, locale } = await params;
  let product = null;

  try {
    const { data } = await api.get(`/products/${id}`);
    product = data;
  } catch (err) {
    console.error("Error fetching product:", err);
  }

  return <ProductClient product={product} locale={locale} />;
}
