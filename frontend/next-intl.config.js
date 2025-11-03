/** @type {import('next-intl').Config} */
const nextIntlConfig = {
  locales: ["en", "ar"],
  defaultLocale: "ar",
  timeZone: "Africa/Cairo" // ✅ must be here
};

export default nextIntlConfig;
