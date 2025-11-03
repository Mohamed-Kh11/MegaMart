// export const metadata = {
//   title: "Under 100 LE | Mega Mart",
//   description:
//     "Shop amazing deals under 100 LE at Mega Mart — affordable fashion, beauty, gadgets, and home essentials without breaking the bank.",
// };


export default function Under100Layout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
