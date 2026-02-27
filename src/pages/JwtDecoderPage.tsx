import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import JwtDecoderTool from "../tools/JwtDecoder";
import { useTranslation } from "@/hooks/useI18n";

export default function JwtDecoderPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("jwt.title")} description={t("jwt.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("jwt.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("jwt.subtitle")}</p>
      <div className="mt-6"><JwtDecoderTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("jwt.whatIs")}</p></ContentSection>
      <ContentSection title={t("common.howToUse")}>
        <p>{t("jwt.howTo1")}</p>
        <p>{t("jwt.howTo2")}</p>
        <p>{t("jwt.howTo3")}</p>
        <p>{t("jwt.howTo4")}</p>
        <p>{t("jwt.howTo5")}</p>
      </ContentSection>
      <RelatedTools currentId="jwt-decoder" />
    </article>
  );
}
