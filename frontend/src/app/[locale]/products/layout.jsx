export const metadata = {
  title: "All Products | Mega Mart",
  description:
    "Browse all products at Mega Mart — electronics, fashion, beauty, groceries, home essentials, and more in one convenient place.",
};


export default function ProductsLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
