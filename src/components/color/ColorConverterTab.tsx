import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CopyButton } from "@/components/CopyButton";
import {
  parseColor,
  rgbaToHex,
  rgbaToRgbString,
  rgbaToRgbaString,
  rgbaToHslString,
  bestTextColor,
  contrastRatio,
  detectFormat,
  RGBA,
} from "@/lib/colorParser";

export function ColorConverterTab() {
  const [input, setInput] = useState("#667eea");

  const color = useMemo(() => parseColor(input), [input]);
  const fmt = useMemo(() => detectFormat(input), [input]);

  // hex value used by the color picker; falls back to #000000 when parsing fails
  const colorHex = color ? rgbaToHex(color) : "#000000";

  const formats = useMemo(() => {
    if (!color) return null;
    return {
      hex: rgbaToHex(color),
      rgb: rgbaToRgbString(color),
      rgba: rgbaToRgbaString(color),
      hsl: rgbaToHslString(color),
    };
  }, [color]);

  const textColor = color ? bestTextColor(color) : "white";
  const whiteContrast = color ? contrastRatio(color, { r: 255, g: 255, b: 255 }).toFixed(2) : "—";
  const blackContrast = color ? contrastRatio(color, { r: 0, g: 0, b: 0 }).toFixed(2) : "—";

  const allFormats = formats ? `${formats.hex}\n${formats.rgb}\n${formats.rgba}\n${formats.hsl}` : "";

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Color Input</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorHex}
            onChange={e => setInput(e.target.value)}
            className="h-8 w-8 rounded border border-border cursor-pointer p-0"
          />
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="#667eea, rgb(102,126,234), hsl(229,73%,66%)"
            className="font-mono"
          />
        </div>
        {fmt !== "unknown" && (
          <p className="text-xs text-muted-foreground">Detected: <span className="font-semibold text-foreground">{fmt.toUpperCase()}</span></p>
        )}
      </div>

      {color && formats && (
        <>
          {/* Preview */}
          <div
            className="rounded-lg h-28 flex items-center justify-center text-lg font-bold border border-border"
            style={{ backgroundColor: formats.hex, color: textColor }}
          >
            {formats.hex}
          </div>

          {/* Conversions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(Object.entries(formats) as [string, string][]).map(([label, val]) => (
              <div key={label} className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/50 px-3 py-2">
                <div>
                  <span className="text-xs text-muted-foreground uppercase">{label}</span>
                  <p className="font-mono text-sm text-foreground">{val}</p>
                </div>
                <CopyButton text={val} />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <CopyButton text={allFormats} className="flex-1 justify-center" />
          </div>

          {/* Contrast */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">vs White</p>
              <p className="text-lg font-bold text-foreground">{whiteContrast}:1</p>
              <WcagBadge ratio={+whiteContrast} />
            </div>
            <div className="rounded-md border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">vs Black</p>
              <p className="text-lg font-bold text-foreground">{blackContrast}:1</p>
              <WcagBadge ratio={+blackContrast} />
            </div>
          </div>
        </>
      )}

      {!color && input.trim() && (
        <p className="text-sm text-destructive">Could not parse color. Try HEX, RGB, RGBA, or HSL.</p>
      )}
    </div>
  );
}

function WcagBadge({ ratio }: { ratio: number }) {
  const level = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "AA Large" : "Fail";
  const color = ratio >= 4.5 ? "text-green-600 dark:text-green-400" : ratio >= 3 ? "text-yellow-600 dark:text-yellow-400" : "text-destructive";
  return <span className={`text-xs font-semibold ${color}`}>{level}</span>;
}
