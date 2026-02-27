import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { RelatedTools } from "../components/RelatedTools";
import ImageConverterTool from "../tools/ImageConverter";
import { useTranslation } from "@/hooks/useI18n";

export default function ImageConverterPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("imageConverter.title")} description={t("imageConverter.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("imageConverter.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("imageConverter.subtitle")}</p>
      <div className="mt-6"><ImageConverterTool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("imageConverter.whatIs")}</p></ContentSection>
      <RelatedTools currentId="image-converter" />
    </article>
  );
}
