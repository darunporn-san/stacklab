import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import JsonFormatterTool from "../tools/JsonFormatter";

export default function JsonFormatterPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="JSON Formatter & Validator"
        description="Format, minify, and validate JSON online. Free JSON beautifier with syntax highlighting, error detection, and line numbers. Runs locally in your browser."
      />
      <h1 className="text-2xl font-semibold tracking-tight">JSON Formatter & Validator</h1>
      <p className="mt-1 text-sm text-muted-foreground">Format, minify, and validate JSON data instantly in your browser.</p>

      <div className="mt-6">
        <JsonFormatterTool />
      </div>

      <ContentSection title="What is JSON Formatter?">
        <p>A JSON Formatter takes raw or minified JSON data and reformats it with proper indentation, making it human-readable. It also validates the JSON structure and highlights syntax errors with line numbers.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Paste your JSON into the input area.</p>
        <p>2. Click <strong>Format</strong> to beautify or <strong>Minify</strong> to compress.</p>
        <p>3. If the JSON is invalid, you'll see an error message with details.</p>
        <p>4. Click <strong>Copy</strong> to copy the result to your clipboard.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`// Input (minified):
{"name":"DevToolbox","version":"1.0","tools":["json","jwt","base64"]}

// Output (formatted):
{
  "name": "DevToolbox",
  "version": "1.0",
  "tools": [
    "json",
    "jwt",
    "base64"
  ]
}`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my data sent to any server?", a: "No. All processing happens locally in your browser. Your data never leaves your device." },
        { q: "What JSON standards are supported?", a: "The tool supports standard JSON as defined by RFC 8259. It does not support JSON5, trailing commas, or comments." },
        { q: "Can I format large JSON files?", a: "Yes, the tool handles large JSON payloads efficiently since it uses native browser JSON parsing." },
      ]} />

      <RelatedTools currentId="json-formatter" />
    </article>
  );
}
