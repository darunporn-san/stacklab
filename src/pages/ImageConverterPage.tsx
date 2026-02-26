import { SeoHead } from "../components/SeoHead";
import { ContentSection } from "../components/ContentSection";
import { FaqSection } from "../components/FaqSection";
import { RelatedTools } from "../components/RelatedTools";
import ImageConverterTool from "../tools/ImageConverter";

export default function ImageConverterPage() {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Image Converter — Resize, WebP, Base64 & Snippets"
        description="Convert, resize, and optimize images to WebP, PNG, or JPEG. Generate Base64 strings, data URLs, and code snippets — all client-side."
      />
      <h1 className="text-2xl font-semibold tracking-tight">Image Converter</h1>
      <p className="mt-1 text-sm text-muted-foreground">Resize, convert formats, and generate Base64 or code snippets from any image.</p>

      <div className="mt-6">
        <ImageConverterTool />
      </div>

      <ContentSection title="What is the Image Converter?">
        <p>A browser-based tool for frontend developers to quickly resize images, convert formats (WebP, PNG, JPEG), generate Base64 data URLs, and create ready-to-use HTML/CSS/Next.js snippets.</p>
      </ContentSection>

      <ContentSection title="How to Use">
        <p>1. Drag & drop or select an image file.</p>
        <p>2. Choose output format and adjust quality.</p>
        <p>3. Optionally set width/height to resize.</p>
        <p>4. Copy the Base64 string, download the file, or grab a code snippet.</p>
      </ContentSection>

      <FaqSection items={[
        { q: "Is my image uploaded to a server?", a: "No. All processing uses the Canvas API in your browser." },
        { q: "What formats are supported?", a: "Input: any browser-supported image. Output: WebP, PNG, JPEG." },
        { q: "Does it maintain aspect ratio?", a: "Yes by default. You can toggle this off for custom dimensions." },
      ]} />

      <RelatedTools currentId="image-converter" />
    </article>
  );
}
