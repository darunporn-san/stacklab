import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import ResponsiveLayoutLabTool from "../tools/ResponsiveLayoutLab";

export default function ResponsiveLayoutLabPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Responsive Layout Lab — Flexbox & Grid Builder"
        description="Visually build responsive Flexbox and Grid layouts with per-breakpoint configuration. Export production-ready CSS, Tailwind, React JSX, and Vue code."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Responsive Layout Lab</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Visually build Flexbox & Grid layouts with responsive breakpoints — export clean code instantly.
      </p>

      <div className="mt-6">
        <ResponsiveLayoutLabTool />
      </div>

      <ContentSection title="What is this?">
        <p>An interactive playground for building responsive CSS layouts. Switch between Flexbox and Grid modes, configure properties per breakpoint, preview in real-time, and export production-ready CSS, Tailwind classes, React JSX, or Vue templates.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Choose Flex or Grid mode.</p>
        <p>2. Adjust layout properties in the controls panel.</p>
        <p>3. Switch breakpoints to set responsive overrides.</p>
        <p>4. Preview at different viewport widths using presets or custom input.</p>
        <p>5. Export code in your preferred format and copy with one click.</p>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my layout saved?", a: "Yes. Your layout is persisted in localStorage so it survives page reloads." },
        { q: "Does it support responsive design?", a: "Yes. Each breakpoint (base, sm, md, lg, xl) stores separate configuration that merges mobile-first." },
        { q: "Can I export to Tailwind?", a: "Yes. The export panel generates responsive Tailwind utility classes with proper breakpoint prefixes." },
        { q: "Does it work offline?", a: "Yes. Everything runs entirely in your browser with no server required." },
      ]} />

      <RelatedTools currentId="responsive-layout-lab" />
    </article>
  );
}
