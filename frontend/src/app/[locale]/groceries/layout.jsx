// export const metadata = {
//   title: "Groceries | Mega Mart",
//   description:
//     "Shop fresh groceries, pantry staples, snacks, and beverages at Mega Mart — quality ingredients and everyday essentials delivered fast.",
// };


export default function GroceriesLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
