import { ToolLayout } from "@/components/ToolLayout";
import { SeoHead } from "@/components/SeoHead";
import FrontendCoreUtilities from "@/tools/FrontendCoreUtilities";
import { ContentSection } from "@/components/ContentSection";
import { FaqSection } from "@/components/FaqSection";
import { useTranslation } from "@/hooks/useI18n";

export default function FrontendCoreUtilitiesPage() {
  const { t } = useTranslation();

  return (
    <>
      <SeoHead
        title="Frontend Core Utilities — DevToolbox"
        description="Date formatter, currency formatter, device checker, debounce/throttle playground, and object tools — all in-browser."
      />
      <ToolLayout
        title="Frontend Core Utilities"
        description="Date formatting, currency formatting, device detection, debounce/throttle playground, and object manipulation — all client-side."
      >
        <FrontendCoreUtilities />

        <div className="mt-10 space-y-6">
          <ContentSection title={t("common.whatIsIt")}>
            <p>A collection of 5 essential frontend utilities: Date Formatter with multiple output formats, Currency Formatter using Intl.NumberFormat, live Device Checker, interactive Debounce &amp; Throttle Playground, and Object Tools (pick, omit, flatten, sort keys, deep clone). Everything runs entirely in your browser.</p>
          </ContentSection>
          <ContentSection title={t("common.howToUse")}>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Switch between tabs to access each tool.</li>
              <li>Date Formatter: pick a date or type one manually to see all formats.</li>
              <li>Currency: enter a number and select currency for formatted output.</li>
              <li>Device Checker: see live viewport dimensions and device type.</li>
              <li>Debounce/Throttle: type in the textarea and observe trigger behavior.</li>
              <li>Object Tools: paste JSON, pick an operation, and run.</li>
            </ol>
          </ContentSection>
          <FaqSection
            items={[
              { q: "Is any data sent to a server?", a: "No. Everything runs locally in your browser. No data leaves your machine." },
              { q: "Can I use this on mobile?", a: "Yes. The UI is fully responsive and works on all screen sizes." },
              { q: "Which currencies are supported?", a: "THB, USD, and EUR are available. The formatter uses Intl.NumberFormat for locale-aware output." },
            ]}
          />
        </div>
      </ToolLayout>
    </>
  );
}
