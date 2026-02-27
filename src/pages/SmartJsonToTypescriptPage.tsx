import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import SmartJsonToTypescript from "../tools/SmartJsonToTypescript";

export default function SmartJsonToTypescriptPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Smart JSON → TypeScript Pro | Type Inference Engine"
        description="Production-grade JSON to TypeScript generator with union types, nullable detection, enum inference, Zod schemas, and smart analysis. Free browser-based tool."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Smart JSON → TypeScript Pro</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Production-grade type inference engine — interfaces, types, Zod schemas, and JSON Schema from any JSON.
      </p>

      <div className="mt-6">
        <SmartJsonToTypescript />
      </div>

      <ContentSection title="What Makes This Smart?">
        <p>Unlike basic converters, this engine merges array object structures, detects nullable and optional fields, infers string literal unions, identifies enum candidates, and generates multiple output formats — all running entirely in your browser.</p>
      </ContentSection>

      <ContentSection title="Supported Output Formats">
        <p>• <strong>TypeScript interfaces</strong> — clean, extracted nested types</p>
        <p>• <strong>Type aliases</strong> — flat or nested type definitions</p>
        <p>• <strong>Zod schemas</strong> — runtime validation with z.object, z.enum, .nullable()</p>
        <p>• <strong>JSON Schema</strong> — draft-07 compatible schemas</p>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my data sent to a server?", a: "No. Everything runs locally in your browser. Your data never leaves your device." },
        { q: "Does it handle arrays of objects?", a: "Yes. It merges all objects in an array to infer a unified type with optional and nullable fields." },
        { q: "Can it detect enums?", a: "Yes. String fields with a small set of repeated values are detected as enum candidates." },
        { q: "Does it support Zod?", a: "Yes. Select 'Zod Schema' in settings to generate z.object structures with proper validators." },
      ]} />

      <RelatedTools currentId="smart-json-to-typescript" />
    </article>
  );
}
