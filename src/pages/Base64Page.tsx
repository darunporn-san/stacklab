import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import Base64Tool from "../tools/Base64Tool";

export default function Base64Page() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Base64 Encoder & Decoder"
        description="Encode and decode Base64 strings online. Supports UTF-8 text. Free, fast, and runs entirely in your browser."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Base64 Encoder & Decoder</h1>
      <p className="mt-1 text-sm text-muted-foreground">Encode text to Base64 or decode Base64 strings instantly.</p>

      <div className="mt-6"><Base64Tool /></div>

      <ContentSection title="What is Base64?">
        <p>Base64 is a binary-to-text encoding scheme that represents binary data as ASCII characters. It's commonly used for embedding data in URLs, emails, HTML, and JSON payloads.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Enter plain text to encode, or a Base64 string to decode.</p>
        <p>2. Click <strong>Encode</strong> or <strong>Decode</strong>.</p>
        <p>3. Copy the result with the copy button.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`// Encode:
"Hello, World!" → "SGVsbG8sIFdvcmxkIQ=="

// Decode:
"SGVsbG8sIFdvcmxkIQ==" → "Hello, World!"`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Does Base64 encrypt data?", a: "No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string." },
        { q: "Does it support Unicode/UTF-8?", a: "Yes. This tool handles UTF-8 text correctly by encoding/decoding through URI component conversion." },
        { q: "Is there a size limit?", a: "No hard limit — it runs in your browser, so it depends on available memory." },
      ]} />

      <RelatedTools currentId="base64-encoder" />
    </article>
  );
}
