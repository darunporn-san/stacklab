import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import SmartJsonToTypescript from "../tools/SmartJsonToTypescript";
import { useTranslation } from "@/hooks/useI18n";

export default function SmartJsonToTypescriptPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("smartJsonTs.title")} description={t("smartJsonTs.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("smartJsonTs.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("smartJsonTs.subtitle")}</p>
      <div className="mt-6"><SmartJsonToTypescript /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("smartJsonTs.whatIs")}</p></ContentSection>
      
    </article>
  );
}
