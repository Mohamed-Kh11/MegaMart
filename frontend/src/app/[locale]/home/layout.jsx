// export const metadata = {
//   title: "Home Appliances | Mega Mart",
//   description:
//     "Upgrade your home with reliable appliances from Mega Mart — refrigerators, washing machines, microwaves, and more from trusted brands.",
// };


export default function HomeLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-28 sm:pt-36 md:pt-30 lg:pt-24 flex items-center justify-center">
      {children}
    </section>
  );
}
