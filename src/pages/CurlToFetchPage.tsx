import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";

import CurlToFetchTool from "../tools/CurlToFetch";

export default function CurlToFetchPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Curl to Fetch Converter"
        description="Convert curl commands to JavaScript fetch() code. Parses method, headers, and body automatically. Free online converter."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Curl to Fetch Converter</h1>
      <p className="mt-1 text-sm text-muted-foreground">Convert curl commands to clean JavaScript fetch() code.</p>

      <div className="mt-6"><CurlToFetchTool /></div>

      <ContentSection title="What is This Tool?">
        <p>This converter takes a curl command (commonly copied from browser DevTools or API documentation) and transforms it into equivalent JavaScript fetch() code that you can use directly in your application.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Paste your curl command into the input area.</p>
        <p>2. Click <strong>Convert</strong>.</p>
        <p>3. The equivalent fetch() code appears in the output.</p>
        <p>4. Copy the code with the copy button.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`// Input:
curl -X POST "https://api.example.com/users" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John"}'

// Output:
const response = await fetch("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: '{"name": "John"}'
});
const data = await response.json();`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "What curl options are supported?", a: "The tool supports -X (method), -H (headers), -d/--data/--data-raw (body), and URL extraction." },
        { q: "Does it support file uploads?", a: "Not currently. File uploads with -F/--form require FormData which adds complexity." },
        { q: "Can I use the output directly?", a: "Yes. The output is valid JavaScript using the Fetch API. Wrap it in an async function if needed." },
      ]} />

      
    </article>
  );
}
