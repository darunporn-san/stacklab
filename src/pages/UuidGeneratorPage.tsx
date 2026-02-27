import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import UuidGeneratorTool from "../tools/UuidGenerator";
import { useTranslation } from "@/hooks/useI18n";

export default function UuidGeneratorPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("uuid.title")} description={t("uuid.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("uuid.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("uuid.subtitle")}</p>
      <div className="mt-6"><UuidGeneratorTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("uuid.whatIs")}</p></ContentSection>
      <ContentSection title={t("common.howToUse")}>
        <p>{t("uuid.howTo1")}</p>
        <p>{t("uuid.howTo2")}</p>
        <p>{t("uuid.howTo3")}</p>
      </ContentSection>
      
    </article>
  );
}
