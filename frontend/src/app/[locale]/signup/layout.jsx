export const metadata = {
  title: "Sign Up",
  description: "Join our Mega Mart family now.",
};

export default function SignupLayout({ children }) {
  return (
    <section className="mx-auto px-6 sm:py-8 lg:py-2 flex items-center justify-center">
      {children}
    </section>
  );
}
