import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import TimestampConverterTool from "../tools/TimestampConverter";

export default function TimestampConverterPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Unix Timestamp Converter"
        description="Convert Unix timestamps to human-readable dates and vice versa. Auto-detects seconds vs milliseconds. Shows local time and UTC."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Unix Timestamp Converter</h1>
      <p className="mt-1 text-sm text-muted-foreground">Convert between Unix timestamps and human-readable dates.</p>

      <div className="mt-6"><TimestampConverterTool /></div>

      <ContentSection title="What is a Unix Timestamp?">
        <p>A Unix timestamp (also called Epoch time) is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC. It's widely used in programming, databases, and APIs for representing dates and times.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Enter a Unix timestamp to convert to a readable date, or use the date picker to get a timestamp.</p>
        <p>2. The tool auto-detects whether your input is in seconds or milliseconds.</p>
        <p>3. Both local time and UTC are displayed.</p>
        <p>4. Click <strong>Now</strong> to insert the current timestamp.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`Timestamp: 1700000000
Local: 11/14/2023, 3:13:20 PM
UTC: Tue, 14 Nov 2023 22:13:20 GMT
ISO: 2023-11-14T22:13:20.000Z`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "How does auto-detection work?", a: "If the number is greater than 1 trillion, it's treated as milliseconds. Otherwise, it's treated as seconds." },
        { q: "What timezone is used?", a: "Both your local timezone and UTC are shown side by side." },
        { q: "Can I convert negative timestamps?", a: "Yes. Negative timestamps represent dates before January 1, 1970." },
      ]} />

      <RelatedTools currentId="timestamp-converter" />
    </article>
  );
}
