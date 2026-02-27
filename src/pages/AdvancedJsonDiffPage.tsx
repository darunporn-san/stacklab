import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { RelatedTools } from "../components/RelatedTools";
import AdvancedJsonDiff from "../tools/AdvancedJsonDiff";
import { useTranslation } from "@/hooks/useI18n";

export default function AdvancedJsonDiffPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("jsonDiff.title")} description={t("jsonDiff.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("jsonDiff.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("jsonDiff.subtitle")}</p>
      <div className="mt-6"><AdvancedJsonDiff /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("jsonDiff.whatIs")}</p></ContentSection>
      <RelatedTools currentId="advanced-json-diff" />
    </article>
  );
}
