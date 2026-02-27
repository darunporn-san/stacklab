import { SeoHead } from "@/components/SeoHead";
import RouteQuerySplitter from "@/tools/RouteQuerySplitter";
import { useTranslation } from "@/hooks/useI18n";

export default function RouteQuerySplitterPage() {
  const { t } = useTranslation();
  return (
    <>
      <SeoHead title={t("routeQuery.title")} description={t("routeQuery.seoDesc")} />
      <RouteQuerySplitter />
    </>
  );
}
