"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setTimeout(() => setVisible(true), 1000); // show after 1s
    }
  }, []);

  const handleConsent = (accepted) => {
    localStorage.setItem("cookieConsent", accepted ? "accepted" : "rejected");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 z-50 
                     bg-neutral-800 text-white dark:bg-neutral-900 rounded-2xl shadow-lg 
                     p-4 flex flex-col md:flex-row items-center justify-between gap-3 max-w-2xl"
        >
          <p className="text-sm md:text-base text-center md:text-left">
            {t("message")}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handleConsent(true)}
              className="px-4 py-2 bg-MegaLight hover:bg-MegaLight2 rounded-xl text-white text-sm"
            >
              {t("allow")}
            </button>
            <button
              onClick={() => handleConsent(false)}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 rounded-xl text-white text-sm"
            >
              {t("reject")}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
