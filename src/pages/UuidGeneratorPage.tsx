import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import UuidGeneratorTool from "../tools/UuidGenerator";

export default function UuidGeneratorPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="UUID Generator"
        description="Generate random v4 UUIDs online. Create single or bulk UUIDs instantly. Copy to clipboard with one click. Runs in your browser."
      />
      <h1 className="text-2xl font-semibold tracking-tight">UUID Generator</h1>
      <p className="mt-1 text-sm text-muted-foreground">Generate cryptographically random v4 UUIDs instantly.</p>

      <div className="mt-6"><UuidGeneratorTool /></div>

      <ContentSection title="What is a UUID?">
        <p>A Universally Unique Identifier (UUID) is a 128-bit identifier that is unique across space and time. Version 4 UUIDs are randomly generated using cryptographically secure random number generators.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Select how many UUIDs to generate (1–50).</p>
        <p>2. Click <strong>Generate</strong>.</p>
        <p>3. Click <strong>Copy</strong> on any individual UUID or copy all at once.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`550e8400-e29b-41d4-a716-446655440000
6ba7b810-9dad-11d1-80b4-00c04fd430c8
f47ac10b-58cc-4372-a567-0e02b2c3d479`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Are these UUIDs truly random?", a: "Yes. They use the Web Crypto API (crypto.randomUUID()) which provides cryptographically secure randomness." },
        { q: "What UUID version is generated?", a: "Version 4 (random). This is the most commonly used version for generating unique identifiers." },
        { q: "Can UUIDs collide?", a: "Theoretically possible but astronomically unlikely. The probability of collision in 103 trillion v4 UUIDs is about 1 in a billion." },
      ]} />

      <RelatedTools currentId="uuid-generator" />
    </article>
  );
}
