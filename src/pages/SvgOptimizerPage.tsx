import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { RelatedTools } from "../components/RelatedTools";
import SvgOptimizerTool from "../tools/SvgOptimizer";
import { useTranslation } from "@/hooks/useI18n";

export default function SvgOptimizerPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("svg.title")} description={t("svg.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("svg.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("svg.subtitle")}</p>
      <div className="mt-6"><SvgOptimizerTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("svg.whatIs")}</p></ContentSection>
      <RelatedTools currentId="svg-optimizer" />
    </article>
  );
}
