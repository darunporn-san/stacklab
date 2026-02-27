import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import RegexTesterTool from "../tools/RegexTester";

export default function RegexTesterPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Regex Tester"
        description="Test regular expressions with real-time match highlighting and build validation rules visually with our Regex Rule Builder. Free online regex tool."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Regex Tester</h1>
      <p className="mt-1 text-sm text-muted-foreground">Test and debug regular expressions with real-time match highlighting.</p>

      <div className="mt-6"><RegexTesterTool /></div>

      <ContentSection title="What is Regex?">
        <p>Regular expressions (regex) are patterns used to match character combinations in strings. They're essential for text search, validation, and data extraction in programming.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Enter your regex pattern in the pattern field.</p>
        <p>2. Toggle flags (g for global, i for case-insensitive, m for multiline).</p>
        <p>3. Enter test text — matches are highlighted in real time.</p>
        <p>4. The match count is displayed below.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`Pattern: \\b[A-Z][a-z]+\\b
Flags: g
Text: "Hello World from DevToolbox"
Matches: Hello, World, Dev, Toolbox (4 matches)`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Which regex engine is used?", a: "The tool uses JavaScript's native RegExp engine, which supports ECMAScript regex syntax." },
        { q: "Can I test multiline patterns?", a: "Yes. Enable the 'm' flag to make ^ and $ match line boundaries instead of string boundaries." },
        { q: "Are lookaheads supported?", a: "Yes. JavaScript supports positive/negative lookaheads and lookbehinds in modern browsers." },
      ]} />

      <RelatedTools currentId="regex-tester" />
    </article>
  );
}
