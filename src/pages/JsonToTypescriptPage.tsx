import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import JsonToTypescriptTool from "../tools/JsonToTypescript";

export default function JsonToTypescriptPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="JSON to TypeScript Interface Generator"
        description="Generate TypeScript interfaces from JSON data instantly. Handles nested objects, arrays, nullable fields, and union types. Free browser-based tool."
      />
      <h1 className="text-2xl font-semibold tracking-tight">JSON to TypeScript Interface Generator</h1>
      <p className="mt-1 text-sm text-muted-foreground">Paste JSON and generate TypeScript types instantly in your browser.</p>

      <div className="mt-6">
        <JsonToTypescriptTool />
      </div>

      <ContentSection title="What is JSON to TypeScript?">
        <p>This tool converts raw JSON data into strongly-typed TypeScript interfaces or type aliases. It handles nested objects, arrays, nullable fields, and can detect union types — all powered by quicktype running entirely in your browser.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Paste your JSON into the input area.</p>
        <p>2. Optionally set the root interface name and toggle advanced options.</p>
        <p>3. Click <strong>Generate</strong> to produce TypeScript definitions.</p>
        <p>4. Copy the output with one click.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`// Input JSON:
{
  "user": { "name": "Alice", "age": 30 },
  "tags": ["admin", "dev"]
}

// Generated TypeScript:
export interface Root {
  user: User;
  tags: string[];
}

export interface User {
  name: string;
  age: number;
}`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my data sent to a server?", a: "No. Everything runs locally in your browser using quicktype-core. Your data never leaves your device." },
        { q: "Does it handle nested objects?", a: "Yes. Nested objects are extracted into separate named interfaces automatically." },
        { q: "Can I use type aliases instead of interfaces?", a: "Yes. Toggle the 'Use type' option to generate type aliases instead." },
        { q: "Does it detect optional or nullable fields?", a: "Yes. Fields with null values are typed as nullable, and you can toggle all fields to optional." },
      ]} />

      <RelatedTools currentId="json-to-typescript" />
    </article>
  );
}
