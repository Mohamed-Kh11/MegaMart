// export const metadata = {
//   title: "Egypt Explorer | Flights",
//   description: "Search and compare flights to Egypt, with up-to-date schedules and prices.",
// };

export default function profileLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-20 flex items-center justify-center">
      {children}
    </section>
  );
}
