import { ToolLayout } from "@/components/ToolLayout";
import JsonTreeViewer from "@/tools/JsonTreeViewer";

const JsonTreeViewerPage = () => (
  <ToolLayout
    title="JSON Tree Viewer"
    description="Interactive JSON explorer with collapsible tree, search, and inspector panel."
  >
    <JsonTreeViewer />
  </ToolLayout>
);

export default JsonTreeViewerPage;
