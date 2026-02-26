import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import JwtDecoderTool from "../tools/JwtDecoder";

export default function JwtDecoderPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="JWT Decoder"
        description="Decode and inspect JWT tokens online. View header, payload, and expiration dates. No signature verification — runs locally in your browser."
      />
      <h1 className="text-2xl font-semibold tracking-tight">JWT Decoder</h1>
      <p className="mt-1 text-sm text-muted-foreground">Decode and inspect JSON Web Tokens without sending data to any server.</p>

      <div className="mt-6"><JwtDecoderTool /></div>

      <ContentSection title="What is a JWT?">
        <p>A JSON Web Token (JWT) is a compact, URL-safe token format used for securely transmitting claims between parties. It consists of three Base64URL-encoded parts: header, payload, and signature.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Paste your JWT token into the input field.</p>
        <p>2. The header and payload are decoded automatically.</p>
        <p>3. Timestamps like <code className="font-mono text-code-foreground">exp</code> and <code className="font-mono text-code-foreground">iat</code> are converted to readable dates.</p>
        <p>4. Copy the decoded output with the copy button.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Does this verify the JWT signature?", a: "No. This is a decoder only. Signature verification requires the secret key and is not performed client-side in this tool." },
        { q: "Is it safe to paste my JWT here?", a: "Yes. The token is decoded entirely in your browser and is never transmitted anywhere." },
        { q: "What claims are auto-converted?", a: "The exp (expiration) and iat (issued at) numeric timestamps are automatically converted to human-readable dates." },
      ]} />

      <RelatedTools currentId="jwt-decoder" />
    </article>
  );
}
