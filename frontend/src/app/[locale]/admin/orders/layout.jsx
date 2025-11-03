// export const metadata = {
//   title: "Egypt Explorer | Flights",
//   description: "Search and compare flights to Egypt, with up-to-date schedules and prices.",
// };

export default function OrdersLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-36 sm:pt-40 md:pt-44 lg:pt-28 flex items-center justify-center">
      {children}
    </section>
  );
}
