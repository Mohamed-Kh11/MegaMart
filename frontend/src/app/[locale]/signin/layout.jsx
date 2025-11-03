export const metadata = {
  title: "Mega Mart | Sign In",
  description: "Sign in to your Mega Mart account.",
};


export default function SigninLayout({ children }) {
  return (
    <section className="mx-auto px-6 py-8 lg:py-2 flex items-center justify-center">
      {children}
    </section>
  );
}
