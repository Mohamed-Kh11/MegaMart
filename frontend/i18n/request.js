// i18n/request.js
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // Ensure we always return a real string
  const locale = routing.locales.includes(requestLocale)
    ? requestLocale
    : routing.defaultLocale;

  // console.log("Resolved locale in request.js:", locale, "RequestLocale:", requestLocale);

  return {
    locale, // must be a string
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "Africa/Cairo"
  };
});
