import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import CaseConverterTool from "../tools/CaseConverter";

export default function CaseConverterPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Case Converter — camelCase, snake_case, kebab-case & More"
        description="Convert text between camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE, Title Case and more. Free browser-based developer tool."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Case Converter</h1>
      <p className="mt-1 text-sm text-muted-foreground">Convert text between camelCase, snake_case, kebab-case, and 8 more formats instantly.</p>

      <div className="mt-6">
        <CaseConverterTool />
      </div>

      <ContentSection title="What is a Case Converter?">
        <p>A case converter transforms text between common naming conventions used in programming — such as camelCase for JavaScript variables, snake_case for Python, kebab-case for CSS class names, and PascalCase for class names.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Type or paste your text into the input area.</p>
        <p>2. All case conversions appear instantly below.</p>
        <p>3. Use the copy button next to any result, or "Copy All" to grab everything.</p>
        <p>4. Toggle advanced options like per-line conversion or strict alphanumeric mode.</p>
      </ContentSection>

      <ContentSection title="Supported Formats">
        <ul className="list-disc list-inside space-y-1">
          <li><strong>camelCase</strong> — myVariableName</li>
          <li><strong>PascalCase</strong> — MyClassName</li>
          <li><strong>snake_case</strong> — my_variable_name</li>
          <li><strong>SCREAMING_SNAKE_CASE</strong> — MY_CONSTANT</li>
          <li><strong>kebab-case</strong> — my-css-class</li>
          <li><strong>Train-Case</strong> — My-Header-Name</li>
          <li><strong>dot.case</strong> — config.key.name</li>
          <li><strong>path/case</strong> — file/path/name</li>
          <li><strong>Title Case</strong> — My Document Title</li>
          <li><strong>lowercase / UPPERCASE</strong></li>
        </ul>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my text sent to a server?", a: "No. All conversions happen locally in your browser. Nothing is transmitted." },
        { q: "Does it handle multi-line input?", a: "Yes. Enable 'Convert each line' to process each line independently." },
        { q: "Can it detect the current case?", a: "Yes. The tool auto-detects and displays the detected case of your input." },
        { q: "Does it preserve numbers?", a: "Yes. Numbers within words are preserved during conversion." },
      ]} />

      <RelatedTools currentId="case-converter" />
    </article>
  );
}
