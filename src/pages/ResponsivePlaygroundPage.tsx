import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import ResponsivePlaygroundTool from "../tools/ResponsivePlayground";

export default function ResponsivePlaygroundPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Responsive Playground — Preview Breakpoints & Viewports"
        description="Preview any website across multiple screen sizes. Visualize Tailwind breakpoints, test device presets, and compare layouts side-by-side — all in your browser."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Responsive Playground</h1>
      <p className="mt-1 text-sm text-muted-foreground">Preview websites across screen sizes with real-time breakpoint visualization.</p>

      <div className="mt-6">
        <ResponsivePlaygroundTool />
      </div>

      <ContentSection title="What is the Responsive Playground?">
        <p>A browser-based tool that lets you preview any URL at different viewport sizes. Visualize active Tailwind breakpoints, switch between device presets, and compare multiple breakpoints side-by-side.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Enter a URL and click Load (or press Enter).</p>
        <p>2. Choose a device preset or enter custom dimensions.</p>
        <p>3. Toggle multi-preview to see 3 breakpoints simultaneously.</p>
        <p>4. Use ⌘1-4 keyboard shortcuts to quickly switch presets.</p>
      </ContentSection>

      <FaqSection items={[
        { q: "Does this tool proxy or store the website?", a: "No. The URL is loaded directly in an iframe — nothing is proxied or stored." },
        { q: "Why can't some sites load?", a: "Many sites set X-Frame-Options or CSP headers that block iframe embedding. This is a browser security restriction." },
        { q: "Can I take screenshots?", a: "Cross-origin iframes prevent direct canvas capture. Use your browser's built-in screenshot tools for best results." },
      ]} />

      <RelatedTools currentId="responsive-playground" />
    </article>
  );
}
