import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import RegexTesterTool from "../tools/RegexTester";
import { useTranslation } from "@/hooks/useI18n";

export default function RegexTesterPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("regex.title")} description={t("regex.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("regex.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("regex.subtitle")}</p>
      <div className="mt-6"><RegexTesterTool /></div>
      
    </article>
  );
}
