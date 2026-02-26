import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import SvgOptimizerTool from "../tools/SvgOptimizer";

export default function SvgOptimizerPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="SVG Optimizer & Component Generator — React, Vue, HTML"
        description="Optimize SVG files and convert them to React, Vue, or inline HTML components. Remove attributes, minify, and preview — all in-browser."
      />
      <h1 className="text-2xl font-semibold tracking-tight">SVG Optimizer</h1>
      <p className="mt-1 text-sm text-muted-foreground">Optimize SVGs and generate framework-ready components instantly.</p>

      <div className="mt-6">
        <SvgOptimizerTool />
      </div>

      <ContentSection title="What is the SVG Optimizer?">
        <p>A browser-based tool that cleans, minifies, and converts raw SVG markup into production-ready React, Vue, or HTML components — with live preview and size comparison.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Drag & drop an SVG file or paste markup into the editor.</p>
        <p>2. Toggle optimization options like removing width/height or converting colors to currentColor.</p>
        <p>3. Switch between output tabs to get React, Vue, or inline HTML components.</p>
        <p>4. Copy the output with one click.</p>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my SVG uploaded anywhere?", a: "No. Everything is processed locally in your browser." },
        { q: "Does it support complex SVGs?", a: "Yes. It handles paths, groups, gradients, and nested elements." },
        { q: "Can I customize the component name?", a: "Yes. Use the name input field to set a custom component name." },
      ]} />

      <RelatedTools currentId="svg-optimizer" />
    </article>
  );
}
