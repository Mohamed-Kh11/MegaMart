// export const metadata = {
//   title: "Mobiles | Mega Mart",
//   description:
//     "Explore the latest smartphones at Mega Mart — top brands, best prices, and unbeatable deals on Android and iPhone devices.",
// };

export default function MobileLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
