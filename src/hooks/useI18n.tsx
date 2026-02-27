import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import en, { type Translations } from "@/locales/en";
import th from "@/locales/th";

export type Language = "en" | "th";

const locales: Record<Language, Translations> = { en, th };

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

function getNestedValue(obj: any, path: string): string | undefined {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language || (navigator as any).userLanguage || "en";
  if (browserLang.startsWith("th")) return "th";
  return "en";
}

function getStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem("devtoolbox-lang");
    if (stored === "th" || stored === "en") return stored;
  } catch {}
  return detectBrowserLanguage();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getStoredLanguage);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    try { localStorage.setItem("devtoolbox-lang", newLang); } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    let value = getNestedValue(locales[lang], key);
    if (value === undefined) {
      // Fallback to English
      value = getNestedValue(locales.en, key);
    }
    if (value === undefined) return key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        value = value!.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      });
    }
    return value;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
