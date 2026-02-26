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
        <p>1. Paste your JWT token — it decodes automatically.</p>
        <p>2. Switch between Header, Payload, and Signature tabs.</p>
        <p>3. View the live expiry countdown and timezone-converted timestamps in the status card.</p>
        <p>4. Search, copy individual claims, or copy the entire payload.</p>
        <p>5. Optionally validate the signature using your secret key or public key.</p>
      </ContentSection>

      <ContentSection title="Features">
        <p><strong>Live Expiry Countdown</strong> — Color-coded timer shows time remaining (green/yellow/red).</p>
        <p><strong>Timezone Conversion</strong> — All timestamps shown in both UTC and your local timezone.</p>
        <p><strong>Structured Payload Viewer</strong> — Searchable tree view with syntax highlighting and per-claim copy.</p>
        <p><strong>Signature Validation</strong> — Verify HMAC (HS256/384/512), RSA (RS256), and ECDSA (ES256) signatures locally.</p>
      </ContentSection>

      <ContentSection title="Example">
        <pre className="rounded-lg border border-border bg-code p-4 font-mono text-xs text-code-foreground overflow-auto">
{`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`}
        </pre>
      </ContentSection>

      <FaqSection items={[
        { q: "Does this verify the JWT signature?", a: "Yes! You can optionally validate HMAC and asymmetric signatures. Expand the 'Validate Signature' section in the Signature tab." },
        { q: "Is it safe to paste my JWT here?", a: "Yes. Everything runs locally in your browser. No tokens or keys are ever sent to any server." },
        { q: "What timestamps are auto-converted?", a: "exp (expiration), iat (issued at), and nbf (not before) are converted to human-readable dates in both UTC and your local timezone." },
        { q: "What algorithms are supported for signature validation?", a: "HS256, HS384, HS512 (symmetric), RS256, and ES256 (asymmetric) are supported using the Web Crypto API." },
      ]} />

      <RelatedTools currentId="jwt-decoder" />
    </article>
  );
}
