export const metadata = {
  title: "Reset Password",
};

export default function PasswordLayout({ children }) {
  return (
    <section className="mx-auto px-6 sm:py-8 lg:py-2 flex items-center justify-center">
      {children}
    </section>
  );
}
