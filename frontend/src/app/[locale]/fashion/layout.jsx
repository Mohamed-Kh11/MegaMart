// export const metadata = {
//   title: "Fashion | Mega Mart",
//   description:
//     "Stay stylish with Mega Mart’s fashion collection — trendy clothing, shoes, and accessories for men, women, and kids.",
// };


export default function FashionLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
