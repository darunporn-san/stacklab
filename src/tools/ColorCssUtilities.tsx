import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorConverterTab } from "@/components/color/ColorConverterTab";
import { GradientGeneratorTab } from "@/components/color/GradientGeneratorTab";
import { BoxShadowTab } from "@/components/color/BoxShadowTab";
import { ClampCalculatorTab } from "@/components/color/ClampCalculatorTab";
import { TailwindMatcherTab } from "@/components/color/TailwindMatcherTab";

export default function ColorCssUtilities() {
  const [tab, setTab] = useState("converter");

  return (
    <ToolLayout
      title="Color & CSS Utilities"
      description="Essential color and CSS utilities for frontend developers — converter, gradients, shadows, clamp, Tailwind matcher."
    >
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto">
          <TabsTrigger value="converter" className="text-xs sm:text-sm py-2">🎨 Color</TabsTrigger>
          <TabsTrigger value="gradient" className="text-xs sm:text-sm py-2">🌈 Gradient</TabsTrigger>
          <TabsTrigger value="shadow" className="text-xs sm:text-sm py-2">🟦 Shadow</TabsTrigger>
          <TabsTrigger value="clamp" className="text-xs sm:text-sm py-2">📏 Clamp</TabsTrigger>
          <TabsTrigger value="tailwind" className="text-xs sm:text-sm py-2">🧵 Tailwind</TabsTrigger>
        </TabsList>

        <TabsContent value="converter"><ColorConverterTab /></TabsContent>
        <TabsContent value="gradient"><GradientGeneratorTab /></TabsContent>
        <TabsContent value="shadow"><BoxShadowTab /></TabsContent>
        <TabsContent value="clamp"><ClampCalculatorTab /></TabsContent>
        <TabsContent value="tailwind"><TailwindMatcherTab /></TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
