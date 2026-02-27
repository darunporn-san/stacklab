import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import TimestampConverterTool from "../tools/TimestampConverter";
import { useTranslation } from "@/hooks/useI18n";

export default function TimestampConverterPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("timestamp.title")} description={t("timestamp.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("timestamp.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("timestamp.subtitle")}</p>
      <div className="mt-6"><TimestampConverterTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("timestamp.whatIs")}</p></ContentSection>
      <ContentSection title={t("common.howToUse")}>
        <p>{t("timestamp.howTo1")}</p>
        <p>{t("timestamp.howTo2")}</p>
        <p>{t("timestamp.howTo3")}</p>
        <p>{t("timestamp.howTo4")}</p>
      </ContentSection>
      
    </article>
  );
}
