// export const metadata = {
//   title: "Flash Sale | Mega Mart",
//   description:
//     "Don’t miss out on Mega Mart’s Flash Sale — limited-time discounts on top products across all categories. Shop before it’s gone!",
// };


export default function FlashLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
