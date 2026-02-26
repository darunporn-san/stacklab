export interface SvgOptimizeOptions {
  removeWidthHeight: boolean;
  convertToCurrentColor: boolean;
  removeComments: boolean;
  minify: boolean;
}

const defaultOptions: SvgOptimizeOptions = {
  removeWidthHeight: true,
  convertToCurrentColor: true,
  removeComments: true,
  minify: false,
};

export function optimizeSvg(raw: string, opts: SvgOptimizeOptions = defaultOptions): string {
  let svg = raw.trim();

  if (opts.removeComments) {
    svg = svg.replace(/<!--[\s\S]*?-->/g, "");
  }

  if (opts.removeWidthHeight) {
    svg = svg.replace(/(<svg[^>]*?)\s+width="[^"]*"/gi, "$1");
    svg = svg.replace(/(<svg[^>]*?)\s+height="[^"]*"/gi, "$1");
  }

  if (opts.convertToCurrentColor) {
    svg = svg.replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"');
    svg = svg.replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"');
  }

  if (opts.minify) {
    svg = svg.replace(/\n/g, " ").replace(/\s{2,}/g, " ").replace(/>\s+</g, "><").trim();
  }

  return svg;
}

export function isValidSvg(raw: string): boolean {
  const trimmed = raw.trim();
  return trimmed.startsWith("<svg") && trimmed.includes("</svg>");
}

export function svgToReactComponent(svg: string, name: string): string {
  let jsx = svg
    .replace(/class=/g, "className=")
    .replace(/clip-path=/g, "clipPath=")
    .replace(/fill-rule=/g, "fillRule=")
    .replace(/clip-rule=/g, "clipRule=")
    .replace(/stroke-width=/g, "strokeWidth=")
    .replace(/stroke-linecap=/g, "strokeLinecap=")
    .replace(/stroke-linejoin=/g, "strokeLinejoin=")
    .replace(/stroke-dasharray=/g, "strokeDasharray=")
    .replace(/stroke-dashoffset=/g, "strokeDashoffset=")
    .replace(/stroke-miterlimit=/g, "strokeMiterlimit=")
    .replace(/stroke-opacity=/g, "strokeOpacity=")
    .replace(/fill-opacity=/g, "fillOpacity=")
    .replace(/font-size=/g, "fontSize=")
    .replace(/font-family=/g, "fontFamily=")
    .replace(/font-weight=/g, "fontWeight=")
    .replace(/text-anchor=/g, "textAnchor=")
    .replace(/text-decoration=/g, "textDecoration=")
    .replace(/xmlns:xlink=/g, "xmlnsXlink=")
    .replace(/xlink:href=/g, "xlinkHref=");

  // Add {...props} to root svg tag
  jsx = jsx.replace(/<svg([^>]*)>/, '<svg$1 className={className} {...props}>');

  return `import { SVGProps } from "react";

interface ${name}Props extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function ${name}({ className, ...props }: ${name}Props) {
  return (
    ${jsx}
  );
}`;
}

export function svgToVueComponent(svg: string, name: string): string {
  return `<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  ${svg.replace(/<svg/, '<svg v-bind="$attrs"')}
</template>`;
}

export function svgToInlineHtml(svg: string): string {
  return svg;
}

/** Generate usage example: import .svg file as React component (e.g. via SVGR / Vite plugin) */
export function svgReactImportUsage(fileName: string, name: string): string {
  const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return `// ─── Option 1: Import as React component (SVGR / vite-plugin-svgr) ───
import { ReactComponent as ${name} } from "./${kebab}.svg";
// or with Vite plugin:
// import ${name} from "./${kebab}.svg?react";

function App() {
  return (
    <${name} className="h-6 w-6 text-blue-500" />
  );
}

// ─── Option 2: Import as URL (standard Vite / CRA) ───
import ${kebab}Url from "./${kebab}.svg";

function AppWithImg() {
  return (
    <img src={${kebab}Url} alt="${name}" className="h-6 w-6" />
  );
}`;
}

/** Generate usage example: import .svg file in Vue SFC */
export function svgVueImportUsage(fileName: string, name: string): string {
  const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  return `<!-- Option 1: Import as Vue component (vite-svg-loader) -->
<script setup lang="ts">
import ${name} from "./${kebab}.svg?component";
</script>

<template>
  <${name} class="h-6 w-6 text-blue-500" />
</template>

<!-- Option 2: Import as URL -->
<script setup lang="ts">
import ${kebab}Url from "./${kebab}.svg";
</script>

<template>
  <img :src="${kebab}Url" alt="${name}" class="h-6 w-6" />
</template>`;
}

export function getByteSize(str: string): number {
  return new Blob([str]).size;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
