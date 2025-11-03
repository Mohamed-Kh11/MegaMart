"use client";

import { NextIntlClientProvider } from "next-intl";
import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import store from "../../redux/store.js";

export default function Providers({ children, locale, messages }) {
  return (
      <NextIntlClientProvider locale={locale} timeZone="Africa/Cairo" messages={messages}>
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Provider>
      </NextIntlClientProvider>
  );
}
