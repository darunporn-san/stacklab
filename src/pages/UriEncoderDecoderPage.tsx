import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import UriEncoderDecoderTool from "../tools/UriEncoderDecoderTool";
import { useTranslation } from "@/hooks/useI18n";

export default function UriEncoderDecoderPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("uri.title")} description={t("uri.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("uri.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("uri.subtitle")}</p>
      <div className="mt-6"><UriEncoderDecoderTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("uri.whatIs")}</p></ContentSection>
      <ContentSection title={t("common.howToUse")}>
        <p>{t("uri.howTo1")}</p>
        <p>{t("uri.howTo2")}</p>
        <p>{t("uri.howTo3")}</p>
      </ContentSection>
      <FaqSection items={[
        { q: t("uri.faqDifference"), a: t("uri.faqDifferenceA") },
        { q: t("uri.faqWhen"), a: t("uri.faqWhenA") },
        { q: t("uri.faqSize"), a: t("uri.faqSizeA") },
      ]} />
    </article>
  );
}