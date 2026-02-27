import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import AdvancedJsonDiff from "../tools/AdvancedJsonDiff";

export default function AdvancedJsonDiffPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Advanced JSON Diff — Deep Structural Comparison"
        description="Compare JSON structures with tree diff, array matching strategies, and a professional change inspector. Supports match-by-key, ignore-order, and deep nesting."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Advanced JSON Diff</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Deep structural comparison with tree visualization, array strategies, and change inspector.
      </p>

      <div className="mt-6">
        <AdvancedJsonDiff />
      </div>

      <ContentSection title="What is Advanced JSON Diff?">
        <p>A professional-grade JSON comparison tool that goes beyond line-by-line diffing. It parses JSON structurally, compares nested objects and arrays with configurable strategies, and visualizes changes in an interactive tree with a detailed change inspector.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Paste or load JSON into both panels.</p>
        <p>2. Choose your diff mode: Text (line-based) or JSON Tree (structural).</p>
        <p>3. Select an array comparison strategy: by Index, Ignore Order, or Match by Key.</p>
        <p>4. Click any changed node to open the Change Inspector with full details.</p>
      </ContentSection>

      <FaqSection items={[
        { q: "What array strategies are supported?", a: "Compare by Index (default), Ignore Order (content-based matching), and Match by Key (e.g. match objects by 'id' field)." },
        { q: "Can it handle large JSON?", a: "Yes. The tree uses lazy rendering and only expands nodes on demand to handle 10k+ line JSON efficiently." },
        { q: "Is data sent to a server?", a: "No. All comparison runs entirely in your browser." },
      ]} />

      <RelatedTools currentId="advanced-json-diff" />
    </article>
  );
}
