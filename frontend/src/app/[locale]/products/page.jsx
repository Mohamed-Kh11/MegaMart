import { getTranslations } from "next-intl/server";
import api from "../lib/axios.js";
import ProductsList from "./ProductsList.jsx";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  return {
    title: t("metaTitle", { default: "Mega Mart – Shop Products" }),
    description: t("metaDescription", {
      default: "Discover our full range of quality products at Mega Mart.",
    }),
  };
}

export default async function ProductsPage({ params }) {
  const { locale } = await params;
  const { data } = await api.get("/products");
  const products = Array.isArray(data.products) ? data.products : [];

  return <ProductsList locale={locale} initialProducts={products} />;
}
