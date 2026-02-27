import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { RelatedTools } from "../components/RelatedTools";
import CaseConverterTool from "../tools/CaseConverter";
import { useTranslation } from "@/hooks/useI18n";

export default function CaseConverterPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("caseConverter.title")} description={t("caseConverter.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("caseConverter.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("caseConverter.subtitle")}</p>
      <div className="mt-6"><CaseConverterTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("caseConverter.whatIs")}</p></ContentSection>
      <RelatedTools currentId="case-converter" />
    </article>
  );
}
