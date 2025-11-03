// export const metadata = {
//   title: "Today's Deals | Mega Mart",
//   description:
//     "Save big with Mega Mart’s Today’s Deals — limited-time discounts on top products across electronics, fashion, beauty, and more.",
// };


export default function TodaysDealLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
