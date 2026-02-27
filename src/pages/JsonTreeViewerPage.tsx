import { useTranslation } from "@/hooks/useI18n";
import { ToolLayout } from "@/components/ToolLayout";
import JsonTreeViewer from "@/tools/JsonTreeViewer";

const JsonTreeViewerPage = () => {
  const { t } = useTranslation();
  return (
    <ToolLayout title={t("jsonTree.title")} description={t("jsonTree.subtitle")}>
      <JsonTreeViewer />
    </ToolLayout>
  );
};

export default JsonTreeViewerPage;
