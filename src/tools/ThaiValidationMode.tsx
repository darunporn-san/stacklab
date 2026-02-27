import { useState, useMemo } from "react";
import {
  thaiPresets,
  getThaiFailureReasons,
  getUnicodeExplanations,
  validateThaiIdChecksum,
  normalizeThaiPhone,
  buildThaiCharacterClass,
  createDefaultThaiCharClass,
  type ThaiCharClassConfig,
  type ThaiValidationPreset,
} from "@/lib/thaiValidation";
import { CopyButton } from "@/components/CopyButton";
import { Checkbox } from "@/components/ui/checkbox";
import { generateExport, exportFormats, type ExportFormat } from "@/lib/regexExportGenerator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, Languages, Lightbulb, Phone } from "lucide-react";

export default function ThaiValidationMode() {
  const [selectedPreset, setSelectedPreset] = useState<ThaiValidationPreset | null>(null);
  const [testInput, setTestInput] = useState("");
  const [lang, setLang] = useState<"th" | "en">("th");
  const [charClassConfig, setCharClassConfig] = useState<ThaiCharClassConfig>(createDefaultThaiCharClass());
  const [customMode, setCustomMode] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("typescript");

  const currentPattern = customMode
    ? `^${buildThaiCharacterClass(charClassConfig)}+$`
    : selectedPreset?.pattern || "";
  const currentFlags = customMode ? "u" : selectedPreset?.flags || "";

  const result = useMemo(() => {
    if (!testInput || !currentPattern) return null;
    try {
      const regex = new RegExp(currentPattern, currentFlags);
      const isValid = regex.test(testInput);
      return { isValid, error: "" };
    } catch (e: any) {
      return { isValid: false, error: e.message };
    }
  }, [testInput, currentPattern, currentFlags]);

  const failureReasons = useMemo(() => {
    if (!testInput || !selectedPreset || result?.isValid) return [];
    return getThaiFailureReasons(selectedPreset.id, testInput);
  }, [testInput, selectedPreset, result]);

  const unicodeExplanations = useMemo(() => getUnicodeExplanations(currentPattern), [currentPattern]);

  // Thai ID checksum
  const idCheckResult = useMemo(() => {
    if (selectedPreset?.id !== "thai-id" || !testInput) return null;
    return validateThaiIdChecksum(testInput);
  }, [selectedPreset, testInput]);

  // Phone normalization
  const normalizedPhone = useMemo(() => {
    if (selectedPreset?.id !== "thai-phone" || !testInput) return null;
    return normalizeThaiPhone(testInput);
  }, [selectedPreset, testInput]);

  const exportCode = currentPattern ? generateExport(currentPattern, exportFormat) : "";

  const t = (en: string, th: string) => lang === "th" ? th : en;

  const charClassOptions: { key: keyof ThaiCharClassConfig; labelEn: string; labelTh: string; hint: string }[] = [
    { key: "thaiConsonants", labelEn: "Thai Consonants", labelTh: "พยัญชนะไทย", hint: "ก-ฮ" },
    { key: "thaiVowels", labelEn: "Thai Vowels", labelTh: "สระไทย", hint: "ะ-ๆ" },
    { key: "thaiToneMarks", labelEn: "Thai Tone Marks", labelTh: "วรรณยุกต์", hint: "่-๋" },
    { key: "thaiDigits", labelEn: "Thai Digits", labelTh: "ตัวเลขไทย", hint: "๐-๙" },
    { key: "arabicDigits", labelEn: "Arabic Digits", labelTh: "ตัวเลขอารบิก", hint: "0-9" },
    { key: "englishLetters", labelEn: "English Letters", labelTh: "อักษรอังกฤษ", hint: "A-z" },
    { key: "spaces", labelEn: "Spaces", labelTh: "ช่องว่าง", hint: "\\s" },
    { key: "specialChars", labelEn: "Special Characters", labelTh: "อักขระพิเศษ", hint: "-_./" },
  ];

  return (
    <div className="space-y-5">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setLang(lang === "th" ? "en" : "th")}
          className="flex items-center gap-1.5 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground hover:bg-muted transition-colors"
        >
          <Languages className="h-3.5 w-3.5" />
          {lang === "th" ? "🇹🇭 ไทย" : "🇬🇧 EN"}
        </button>
        <button
          onClick={() => { setCustomMode(false); }}
          className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${!customMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          {t("Presets", "พรีเซ็ต")}
        </button>
        <button
          onClick={() => { setCustomMode(true); }}
          className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${customMode ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
        >
          {t("Custom Builder", "สร้างเอง")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Config */}
        <div className="space-y-4">
          {!customMode ? (
            /* Preset Selection */
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t("Thai Validation Presets", "รูปแบบตรวจสอบภาษาไทย")}</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {thaiPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => { setSelectedPreset(preset); setTestInput(""); }}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                      selectedPreset?.id === preset.id
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <div>
                      <div className="font-medium">{lang === "th" ? preset.nameTh : preset.nameEn}</div>
                      <div className="text-xs text-muted-foreground">{lang === "th" ? preset.descriptionTh : preset.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Custom Thai Character Class Builder */
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">{t("Character Class Builder", "สร้างกลุ่มอักขระ")}</h3>
              <div className="grid grid-cols-2 gap-1.5">
                {charClassOptions.map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 rounded-md border border-border px-2.5 py-2 text-xs cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox
                      checked={charClassConfig[opt.key]}
                      onCheckedChange={() => setCharClassConfig((c) => ({ ...c, [opt.key]: !c[opt.key] }))}
                    />
                    <span className="text-foreground">{lang === "th" ? opt.labelTh : opt.labelEn}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted-foreground">{opt.hint}</span>
                  </label>
                ))}
              </div>
              <div className="rounded-md border border-border bg-code px-3 py-2 font-mono text-xs text-code-foreground break-all">
                {t("Class:", "กลุ่ม:")} <span className="text-primary">{buildThaiCharacterClass(charClassConfig)}</span>
              </div>
            </div>
          )}

          {/* Quick Insert: Example */}
          {selectedPreset && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground">{t("Quick Test", "ทดสอบด่วน")}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTestInput(selectedPreset.example)}
                  className="rounded-md border border-success/50 bg-success/10 px-3 py-1.5 text-xs text-success hover:bg-success/20 transition-colors"
                >
                  ✅ {selectedPreset.example}
                </button>
                <button
                  onClick={() => setTestInput(selectedPreset.counterExample)}
                  className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/20 transition-colors"
                >
                  ❌ {selectedPreset.counterExample}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {/* Pattern Display */}
          {currentPattern && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{t("Generated Pattern", "รูปแบบที่สร้าง")}</h3>
                <CopyButton text={currentPattern} />
              </div>
              <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 font-mono text-sm text-primary break-all">
                /{currentPattern}/{currentFlags}
              </div>

              {/* Unicode Explanation */}
              {unicodeExplanations.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Lightbulb className="h-3.5 w-3.5" /> {t("Unicode Breakdown", "อธิบาย Unicode")}
                  </div>
                  {unicodeExplanations.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-1.5 font-mono text-[11px]">
                      <span className="text-primary font-semibold">{ex.range}</span>
                      <span className="text-foreground">→ {lang === "th" ? ex.labelTh : ex.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Live Test */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">{t("Live Test", "ทดสอบสด")}</h3>
            <textarea
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder={t("Type test input...", "พิมพ์ข้อมูลทดสอบ...")}
              className="h-20 w-full resize-none rounded-lg border border-border bg-code p-3 font-mono text-sm text-code-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              spellCheck={false}
            />
            {testInput && result && (
              <div className="space-y-2">
                <div className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
                  result.error
                    ? "border-destructive/50 bg-destructive/10 text-destructive"
                    : result.isValid
                      ? "border-success/50 bg-success/10 text-success"
                      : "border-destructive/50 bg-destructive/10 text-destructive"
                }`}>
                  {result.error ? (
                    <><XCircle className="h-4 w-4 shrink-0" /> {result.error}</>
                  ) : result.isValid ? (
                    <><CheckCircle2 className="h-4 w-4 shrink-0" /> {t("Valid — Input matches", "ถูกต้อง — ข้อมูลตรงตามรูปแบบ")}</>
                  ) : (
                    <><XCircle className="h-4 w-4 shrink-0" /> {t("Invalid — Does not match", "ไม่ถูกต้อง — ข้อมูลไม่ตรงตามรูปแบบ")}</>
                  )}
                </div>

                {/* Failure Reasons */}
                {!result.isValid && failureReasons.length > 0 && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
                    <span className="text-xs font-medium text-destructive">{t("Failure Reasons:", "เหตุผล:")}</span>
                    {failureReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-destructive/80">
                        <span className="shrink-0 mt-0.5">•</span> {lang === "th" ? r.th : r.en}
                      </div>
                    ))}
                  </div>
                )}

                {/* Thai ID Checksum */}
                {idCheckResult && (
                  <div className={`rounded-lg border p-3 text-xs ${
                    idCheckResult.valid
                      ? "border-success/50 bg-success/10 text-success"
                      : "border-destructive/50 bg-destructive/10 text-destructive"
                  }`}>
                    <span className="font-medium">{t("Checksum:", "ผลตรวจสอบ:")}</span>{" "}
                    {lang === "th" ? idCheckResult.reasonTh : idCheckResult.reason}
                  </div>
                )}

                {/* Phone Normalization */}
                {normalizedPhone && normalizedPhone !== testInput && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-xs">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{t("Normalized:", "รูปแบบมาตรฐาน:")}</span>
                    <span className="font-mono font-medium text-foreground">{normalizedPhone}</span>
                    <CopyButton text={normalizedPhone} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Export */}
          {currentPattern && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{t("Export", "ส่งออก")}</h3>
                <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as ExportFormat)}>
                  <SelectTrigger className="w-[150px] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {exportFormats.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="rounded-lg border border-border bg-code">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-xs font-medium text-muted-foreground">{exportFormats.find((f) => f.value === exportFormat)?.label}</span>
                  <CopyButton text={exportCode} />
                </div>
                <pre className="overflow-auto p-4 font-mono text-xs text-code-foreground whitespace-pre-wrap max-h-48">{exportCode}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
