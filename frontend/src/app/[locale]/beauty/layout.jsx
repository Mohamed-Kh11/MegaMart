// export const metadata = {
//   title: "Beauty Products | Mega Mart",
//   description:
//     "Explore premium beauty products at Mega Mart — skincare, makeup, haircare, and fragrances from top brands, all in one place.",
// };


export default function BeautyLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
