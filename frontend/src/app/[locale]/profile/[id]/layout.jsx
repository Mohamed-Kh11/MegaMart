// export const metadata = {
//   title: "Egypt Explorer | Flights",
//   description: "Search and compare flights to Egypt, with up-to-date schedules and prices.",
// };

export default function profileLayout({ children }) {
  return (
    <section className="mx-auto  py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
