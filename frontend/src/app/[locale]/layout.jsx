import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import getMessages from "../../../i18n/request";
import { routing } from "../../../i18n/routing";
import { Toaster } from "react-hot-toast";

import "../../app/globals.css";
import Providers from "./components/providers";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: {
    default: "Mega Mart",
  },
  description:
    "Discover top-quality products, unbeatable deals, and everything you need — all in one place at Mega Mart.",
  metadataBase: new URL("https://megamart-orcin.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mega Mart – Everything in One Place",
    description:
      "Shop electronics, beauty, fashion, groceries, and more — all at unbeatable prices.",
    url: "https://megamart-orcin.vercel.app/",
    siteName: "Mega Mart",
    images: [
      {
        url: "/images/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Mega Mart – Online Shopping",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mega Mart",
    description:
      "Discover top-quality products and unbeatable deals at Mega Mart.",
    images: ["/images/og-home.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) notFound();

  const { messages } = await getMessages({ requestLocale: locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
        {/* ✅ Pre-hydration script to set dark/light theme before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    const theme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (theme === 'dark' || (!theme && systemDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (_) {}
})();
            `,
          }}
        />

        {/* ✅ JSON-LD Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mega Mart",
              url: "https://www.megamart.com",
              logo: "https://www.megamart.com/logo.png",
              sameAs: [
                "https://www.facebook.com/megamart",
                "https://www.instagram.com/megamart",
                "https://www.twitter.com/megamart",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+201234567890",
                contactType: "Customer Service",
                availableLanguage: ["English", "Arabic"],
              },
            }),
          }}
        />
      </head>

      <body
        className={`min-h-screen transition-colors duration-300 
        bg-amber-50 dark:bg-[#132049] 
        ${locale === "en" ? "font-[Poppins]" : "font-[Alex]"}`}
      >
        <Providers locale={locale} messages={messages}>
          <NavBar />
          <main>{children}</main>
          <Footer />
          <Toaster position="top-center" reverseOrder={false} />
        </Providers>
      </body>
    </html>
  );
}
