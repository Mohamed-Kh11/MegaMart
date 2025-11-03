// i18n.js
import { getRequestConfig } from 'next-intl/server';
 
// The locales your app supports
const locales = ['en', 'ar'];
const defaultLocale = 'en';
 
export default getRequestConfig(async ({ locale }) => {
  // Ensure a valid locale is used
  const resolvedLocale = locales.includes(locale) ? locale : defaultLocale;
 
  return {
    // Explicitly return the resolved locale
    locale: resolvedLocale, 
    messages: (await import(`./messages/${resolvedLocale}.json`)).default
  };
});