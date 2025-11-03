"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

const langs = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const changeLang = (lang) => {
    const cleanedPath = pathname.replace(/^\/(en|ar)(?=\/|$)/, "");
    router.replace(`/${lang}${cleanedPath}`, { scroll: false }); // ✅ no full reload
  };

  return (
    <div className="inline-flex items-center rounded-full bg-white/10 border border-white/20 p-1 shadow-md backdrop-blur-md">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => changeLang(code)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition 
            ${locale === code 
              ? "bg-white text-black shadow-sm" 
              : "text-white hover:bg-white/20"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
