import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";

import ResponsiveLayoutLabTool from "../tools/ResponsiveLayoutLab";
import { useTranslation } from "@/hooks/useI18n";

export default function ResponsiveLayoutLabPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("responsive.labTitle")} description={t("responsive.labSeoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("responsive.labTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("responsive.labSubtitle")}</p>
      <div className="mt-6"><ResponsiveLayoutLabTool /></div>
      
    </article>
  );
}
