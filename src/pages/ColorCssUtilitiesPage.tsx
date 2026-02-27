import { SeoHead } from "@/components/SeoHead";
import ColorCssUtilities from "@/tools/ColorCssUtilities";
import { useTranslation } from "@/hooks/useI18n";

export default function ColorCssUtilitiesPage() {
  const { t } = useTranslation();
  return (
    <>
      <SeoHead title={t("colorCss.title")} description={t("colorCss.seoDesc")} />
      <ColorCssUtilities />
    </>
  );
}
