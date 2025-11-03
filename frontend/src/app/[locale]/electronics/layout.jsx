// export const metadata = {
//   title: "Electronics | Mega Mart",
//   description:
//     "Discover the latest electronics at Mega Mart — smartphones, laptops, TVs, and accessories from top global brands at unbeatable prices.",
// };


export default function ElectronicsLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
