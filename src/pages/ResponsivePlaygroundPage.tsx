import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";

import ResponsivePlaygroundTool from "../tools/ResponsivePlayground";
import { useTranslation } from "@/hooks/useI18n";

export default function ResponsivePlaygroundPage() {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead title={t("responsive.playgroundTitle")} description={t("responsive.playgroundSeoDesc")} />
      <h1 className="text-2xl font-semibold tracking-tight">{t("responsive.playgroundTitle")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("responsive.playgroundSubtitle")}</p>
      <div className="mt-6"><ResponsivePlaygroundTool /></div>
      
    </article>
  );
}
