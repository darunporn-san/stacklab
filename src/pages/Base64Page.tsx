import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import Base64Tool from "../tools/Base64Tool";
import { useTranslation } from "@/hooks/useI18n";

export default function Base64Page() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("base64.title")} description={t("base64.seoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("base64.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("base64.subtitle")}</p>
      <div className="mt-6"><Base64Tool /></div>
      <ContentSection title={t("common.whatIsIt")}><p>{t("base64.whatIs")}</p></ContentSection>
      <ContentSection title={t("common.howToUse")}>
        <p>{t("base64.howTo1")}</p>
        <p>{t("base64.howTo2")}</p>
        <p>{t("base64.howTo3")}</p>
      </ContentSection>
      <FaqSection items={[
        { q: t("base64.faqEncrypt"), a: t("base64.faqEncryptA") },
        { q: t("base64.faqUnicode"), a: t("base64.faqUnicodeA") },
        { q: t("base64.faqSize"), a: t("base64.faqSizeA") },
      ]} />
      
    </article>
  );
}
