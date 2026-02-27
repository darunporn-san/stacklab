import { SeoHead } from "@/components/SeoHead";
import ColorCssUtilities from "@/tools/ColorCssUtilities";

export default function ColorCssUtilitiesPage() {
  return (
    <>
      <SeoHead
        title="Color & CSS Utilities | DevToolbox"
        description="Free online Color Converter, CSS Gradient Generator, Box Shadow Builder, Clamp Calculator and Tailwind Color Matcher for frontend developers."
      />
      <ColorCssUtilities />
    </>
  );
}
