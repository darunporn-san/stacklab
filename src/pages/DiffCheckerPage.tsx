import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import DiffCheckerTool from "../tools/DiffChecker";

export default function DiffCheckerPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Diff Checker — Compare Code & JSON Side by Side"
        description="Compare two blocks of code or JSON and highlight differences visually. Side-by-side or unified view with line numbers and stats."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Diff Checker</h1>
      <p className="mt-1 text-sm text-muted-foreground">Compare code or JSON and see differences highlighted line-by-line.</p>

      <div className="mt-6">
        <DiffCheckerTool />
      </div>

      <ContentSection title="What is the Diff Checker?">
        <p>A VSCode-inspired comparison tool that highlights added, removed, and modified lines between two blocks of text, code, or JSON — with optional whitespace ignoring and key-order normalization.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Paste original code in the left panel and modified code in the right panel.</p>
        <p>2. Differences are highlighted in real-time with line numbers.</p>
        <p>3. Toggle options like ignoring whitespace or JSON key order.</p>
        <p>4. Copy or download the diff result.</p>
      </ContentSection>

      <FaqSection items={[
        { q: "Does it support JSON comparison?", a: "Yes. Enable 'Format JSON' to auto-prettify and 'Ignore JSON key order' for structural comparison." },
        { q: "Is comparison done on a server?", a: "No. All diffing runs locally in your browser using a Myers diff algorithm." },
        { q: "Can I download the diff?", a: "Yes. Click the Download button to save the diff as a .txt file." },
      ]} />

      <RelatedTools currentId="diff-checker" />
    </article>
  );
}
