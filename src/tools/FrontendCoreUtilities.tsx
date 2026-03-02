import { useState, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { CopyButton } from "@/components/CopyButton";
import { CodeBlock } from "@/components/CodeBlock";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Calendar, Clock, DollarSign, Monitor, Timer, Braces, RotateCcw, Smartphone, Tablet, MonitorIcon, Code, ChevronDown } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

/* ─────────────── Snippet Section (reusable) ─────────────── */
interface Snippet { title: string; desc: string; code: string }

function SnippetSection({ snippets }: { snippets: Snippet[] }) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const toggle = (i: number) => setOpenItems(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="mt-6 pt-6 border-t border-border space-y-2">
      <div className="flex items-center gap-2 mb-3">
        <Code className="w-4 h-4 text-primary" />
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Related JS Utils</h4>
      </div>
      {snippets.map((s, idx) => (
        <Collapsible key={idx} open={openItems.has(idx)} onOpenChange={() => toggle(idx)}>
          <CollapsibleTrigger asChild>
            <button className="w-full flex items-center justify-between rounded-lg border border-border bg-muted/30 hover:bg-muted/60 px-4 py-2.5 text-left transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <Code className="w-3.5 h-3.5 text-primary shrink-0" />
                <div className="min-w-0">
                  <span className="font-mono text-sm font-semibold">{s.title}()</span>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{s.desc}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ml-2 ${openItems.has(idx) ? "rotate-180" : ""}`} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <CodeBlock code={s.code} label={`${s.title}.js`} />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

/* ─────────────── Snippet Data ─────────────── */
const snippetFormatDate: Snippet = {
  title: "formatDate",
  desc: "Formats a Date object into a locale-aware string using the built-in Intl.DateTimeFormat API.",
  code: `/**
 * Formats a date using Intl.DateTimeFormat.
 *
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - BCP 47 locale (default: "en-US")
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
function formatDate(date, locale = "en-US", options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const defaults = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };
  return new Intl.DateTimeFormat(locale, defaults).format(d);
}

// ── Example Usage ──
console.log(formatDate(new Date()));
// → "March 2, 2026"

console.log(formatDate("2024-12-25", "th-TH"));
// → "25 ธันวาคม 2567"

console.log(formatDate(Date.now(), "en-GB", {
  weekday: "long",
  hour: "2-digit",
  minute: "2-digit",
}));
// → "Monday, 02:30"`,
};

const snippetFormatCurrency: Snippet = {
  title: "formatCurrency",
  desc: "Formats a number as a currency string using the native Intl.NumberFormat API.",
  code: `/**
 * Formats a number as currency using Intl.NumberFormat.
 *
 * @param {number} amount - The amount to format
 * @param {string} currency - ISO 4217 currency code
 * @param {string} locale - BCP 47 locale (auto-detected)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = "USD", locale) {
  const localeMap = {
    THB: "th-TH", USD: "en-US", EUR: "de-DE",
    GBP: "en-GB", JPY: "ja-JP",
  };
  const resolvedLocale = locale || localeMap[currency] || "en-US";
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency,
  }).format(amount);
}

// ── Example Usage ──
console.log(formatCurrency(1234567.89, "THB"));
// → "฿1,234,567.89"

console.log(formatCurrency(99.5, "USD"));
// → "$99.50"

console.log(formatCurrency(1500, "EUR"));
// → "1.500,00 €"`,
};

const snippetGetDeviceType: Snippet = {
  title: "getDeviceType",
  desc: "Detects whether the current viewport is mobile, tablet, or desktop based on window width.",
  code: `/**
 * Returns the device type based on viewport width.
 *
 * @param {number} width - Window inner width (default: current)
 * @returns {"mobile"|"tablet"|"desktop"} Device category
 */
function getDeviceType(width) {
  const w = width ?? window.innerWidth;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

// ── Example Usage ──
console.log(getDeviceType());       // "desktop" (depends on viewport)
console.log(getDeviceType(375));     // "mobile"
console.log(getDeviceType(768));     // "tablet"
console.log(getDeviceType(1440));    // "desktop"

// Live detection with resize listener:
window.addEventListener("resize", () => {
  const device = getDeviceType();
  document.body.dataset.device = device;
  console.log("Current device:", device);
});`,
};

const snippetDebounce: Snippet = {
  title: "debounce",
  desc: "Delays execution until after a specified wait time has elapsed since the last invocation.",
  code: `/**
 * Creates a debounced version of a function.
 * The function will only execute after \`delay\` ms
 * of inactivity since the last call.
 *
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function with .cancel()
 */
function debounce(fn, delay = 300) {
  let timer;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}

// ── Example Usage ──
const handleSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 500);

document.querySelector("#search").addEventListener("input", (e) => {
  handleSearch(e.target.value);
});`,
};

const snippetThrottle: Snippet = {
  title: "throttle",
  desc: "Limits function execution to at most once every N milliseconds — ideal for scroll/resize handlers.",
  code: `/**
 * Creates a throttled version of a function.
 * Guarantees at most one execution per \`limit\` ms.
 *
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Minimum interval in ms
 * @returns {Function} Throttled function
 */
function throttle(fn, limit = 200) {
  let waiting = false;
  let lastArgs = null;
  return (...args) => {
    if (!waiting) {
      fn(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
        if (lastArgs) {
          fn(...lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

// ── Example Usage ──
const onScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY);
}, 100);

window.addEventListener("scroll", onScroll);`,
};

const snippetDeepClone: Snippet = {
  title: "deepClone",
  desc: "Deep clones any value using structuredClone with a safe JSON fallback for older environments.",
  code: `/**
 * Deep clones a value.
 * Uses structuredClone if available, falls back to JSON.
 *
 * @param {*} obj - Value to clone
 * @returns {*} Deep-cloned copy
 */
function deepClone(obj) {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

// ── Example Usage ──
const original = { user: { name: "Alice", tags: ["admin"] } };
const cloned = deepClone(original);
cloned.user.tags.push("editor");

console.log(original.user.tags); // ["admin"] — not mutated
console.log(cloned.user.tags);   // ["admin", "editor"]`,
};

const snippetIsEmpty: Snippet = {
  title: "isEmpty",
  desc: "Checks if a value is empty — works with objects, arrays, strings, Maps, Sets, null, and undefined.",
  code: `/**
 * Checks whether a value is "empty".
 * Handles: null, undefined, "", [], {}, Map, Set.
 *
 * @param {*} value - Value to check
 * @returns {boolean} true if the value is empty
 */
function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value instanceof Map || value instanceof Set) return value.size === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

// ── Example Usage ──
console.log(isEmpty(null));      // true
console.log(isEmpty(""));        // true
console.log(isEmpty([]));        // true
console.log(isEmpty({}));        // true
console.log(isEmpty({ a: 1 }));  // false`,
};

const snippetRemoveNull: Snippet = {
  title: "removeNullUndefined",
  desc: "Recursively removes all null and undefined values from an object or array.",
  code: `/**
 * Recursively strips null and undefined from an object.
 *
 * @param {*} obj - Input value
 * @returns {*} Cleaned copy
 */
function removeNullUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.filter((item) => item != null).map(removeNullUndefined);
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, removeNullUndefined(v)])
    );
  }
  return obj;
}

// ── Example Usage ──
const dirty = { name: "Alice", age: null, address: { city: "Bangkok", zip: undefined } };
console.log(removeNullUndefined(dirty));
// { name: "Alice", address: { city: "Bangkok" } }`,
};

const snippetGroupBy: Snippet = {
  title: "groupBy",
  desc: "Groups an array of items by a key or callback function — like Lodash's _.groupBy.",
  code: `/**
 * Groups array elements by a key or function.
 *
 * @param {Array} arr - Array to group
 * @param {string|Function} keyOrFn - Property name or grouping fn
 * @returns {Object} Grouped result { key: [...items] }
 */
function groupBy(arr, keyOrFn) {
  const fn = typeof keyOrFn === "function" ? keyOrFn : (item) => item[keyOrFn];
  return arr.reduce((groups, item) => {
    const key = fn(item);
    (groups[key] ??= []).push(item);
    return groups;
  }, {});
}

// ── Example Usage ──
const users = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" },
];
console.log(groupBy(users, "role"));
// { admin: [...], user: [...] }`,
};

const snippetFlatten: Snippet = {
  title: "flattenObject",
  desc: "Flattens a deeply nested object into a single-level object with dot-notation keys.",
  code: `/**
 * Flattens a nested object into dot-notation keys.
 *
 * @param {Object} obj - Object to flatten
 * @param {string} prefix - Key prefix (used in recursion)
 * @returns {Object} Flattened key-value pairs
 */
function flattenObject(obj, prefix = "") {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? \`\${prefix}.\${key}\` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

// ── Example Usage ──
const nested = { user: { name: "Alice", address: { city: "Bangkok" } } };
console.log(flattenObject(nested));
// { "user.name": "Alice", "user.address.city": "Bangkok" }`,
};

/* ─────────────── 1) Date Formatter ─────────────── */
function DateFormatter() {
  const [date, setDate] = useState(new Date());
  const [manualInput, setManualInput] = useState("");

  const handleManualParse = () => {
    const parsed = new Date(manualInput);
    if (!isNaN(parsed.getTime())) setDate(parsed);
  };

  const outputs = [
    { label: "DD/MM/YYYY", value: format(date, "dd/MM/yyyy") },
    { label: "YYYY-MM-DD", value: format(date, "yyyy-MM-dd") },
    { label: "MMM DD, YYYY", value: format(date, "MMM dd, yyyy") },
    { label: "Full DateTime", value: format(date, "EEEE, MMMM do yyyy, HH:mm:ss") },
    { label: "ISO String", value: date.toISOString() },
    { label: "Unix Timestamp (ms)", value: String(date.getTime()) },
    { label: "Relative Time", value: formatDistanceToNow(date, { addSuffix: true }) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date & Time Picker</Label>
          <Input
            type="datetime-local"
            value={format(date, "yyyy-MM-dd'T'HH:mm:ss")}
            onChange={(e) => {
              const d = new Date(e.target.value);
              if (!isNaN(d.getTime())) setDate(d);
            }}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label>Manual Input</Label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 2024-01-15, Jan 15 2024, etc."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualParse()}
              className="bg-background"
            />
            <Button variant="secondary" onClick={handleManualParse} size="sm">Parse</Button>
          </div>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => setDate(new Date())}>
          <Clock className="w-3 h-3 mr-1" /> Now
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {outputs.map((o) => (
          <div key={o.label} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2.5">
            <div className="min-w-0">
              <span className="text-xs text-muted-foreground">{o.label}</span>
              <p className="font-mono text-sm truncate">{o.value}</p>
            </div>
            <CopyButton text={o.value} />
          </div>
        ))}
      </div>
      <SnippetSection snippets={[snippetFormatDate]} />
    </div>
  );
}

/* ─────────────── 2) Currency Formatter ─────────────── */
function CurrencyFormatter() {
  const [amount, setAmount] = useState("1234567.89");
  const [currency, setCurrency] = useState("THB");
  const [decimals, setDecimals] = useState(2);
  const [showSymbol, setShowSymbol] = useState(true);

  const num = parseFloat(amount) || 0;

  const formatted = new Intl.NumberFormat(
    currency === "THB" ? "th-TH" : currency === "EUR" ? "de-DE" : "en-US",
    {
      style: showSymbol ? "currency" : "decimal",
      currency: showSymbol ? currency : undefined,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }
  ).format(num);

  const variants = [
    { label: "THB", val: new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num) },
    { label: "USD", val: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num) },
    { label: "EUR", val: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(num) },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter number" className="bg-background font-mono" />
        </div>
        <div className="space-y-2">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="THB">🇹🇭 THB</SelectItem>
              <SelectItem value="USD">🇺🇸 USD</SelectItem>
              <SelectItem value="EUR">🇪🇺 EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Decimals: {decimals}</Label>
          <Slider value={[decimals]} onValueChange={([v]) => setDecimals(v)} min={0} max={4} step={1} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={showSymbol} onCheckedChange={setShowSymbol} />
        <Label>Show currency symbol</Label>
      </div>
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Formatted Result</p>
              <p className="text-2xl font-mono font-bold">{formatted}</p>
            </div>
            <CopyButton text={formatted} />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {variants.map((v) => (
          <div key={v.label} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2">
            <div>
              <span className="text-xs text-muted-foreground">{v.label}</span>
              <p className="font-mono text-sm">{v.val}</p>
            </div>
            <CopyButton text={v.val} />
          </div>
        ))}
      </div>
      <SnippetSection snippets={[snippetFormatCurrency]} />
    </div>
  );
}

/* ─────────────── 3) Device Checker ─────────────── */
function DeviceChecker() {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const deviceType = size.w < 640 ? "Mobile" : size.w < 1024 ? "Tablet" : "Desktop";
  const DeviceIcon = size.w < 640 ? Smartphone : size.w < 1024 ? Tablet : MonitorIcon;
  const badgeVariant = size.w < 640 ? "destructive" : size.w < 1024 ? "secondary" : "default";
  const ua = navigator.userAgent;

  const infos = [
    { label: "Width", value: `${size.w}px` },
    { label: "Height", value: `${size.h}px` },
    { label: "Pixel Ratio", value: String(window.devicePixelRatio) },
    { label: "Orientation", value: size.w > size.h ? "Landscape" : "Portrait" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <DeviceIcon className="w-10 h-10 text-primary" />
        <div>
          <Badge variant={badgeVariant} className="text-base px-3 py-1">{deviceType}</Badge>
          <p className="text-xs text-muted-foreground mt-1">
            {size.w < 640 ? "<640px" : size.w < 1024 ? "640–1023px" : "≥1024px"}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {infos.map((i) => (
          <Card key={i.label}>
            <CardContent className="pt-3 pb-3 text-center">
              <p className="text-xs text-muted-foreground">{i.label}</p>
              <p className="text-lg font-mono font-bold">{i.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-muted/30 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground mb-1">User Agent</p>
            <p className="text-xs font-mono break-all">{ua}</p>
          </div>
          <CopyButton text={ua} />
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${Math.min((size.w / 1920) * 100, 100)}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Viewport: {size.w}px / 1920px ({Math.round((size.w / 1920) * 100)}%)
      </p>
      <SnippetSection snippets={[snippetGetDeviceType]} />
    </div>
  );
}

/* ─────────────── 4) Debounce & Throttle Playground ─────────────── */
function DebounceThrottlePlayground() {
  const [mode, setMode] = useState<"debounce" | "throttle">("debounce");
  const [delay, setDelay] = useState(500);
  const [input, setInput] = useState("");
  const [triggerCount, setTriggerCount] = useState(0);
  const [lastTrigger, setLastTrigger] = useState<string | null>(null);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const throttleRef = useRef(false);
  const lastValueRef = useRef("");

  const fire = useCallback(() => {
    setTriggerCount((c) => c + 1);
    setLastTrigger(new Date().toLocaleTimeString("en-US", { hour12: false, fractionalSecondDigits: 3 } as any));
  }, []);

  const handleChange = useCallback(
    (val: string) => {
      setInput(val);
      setKeystrokeCount((c) => c + 1);
      lastValueRef.current = val;

      if (mode === "debounce") {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(fire, delay);
      } else {
        if (!throttleRef.current) {
          throttleRef.current = true;
          fire();
          setTimeout(() => {
            throttleRef.current = false;
          }, delay);
        }
      }
    },
    [mode, delay, fire]
  );

  const reset = () => {
    setInput("");
    setTriggerCount(0);
    setLastTrigger(null);
    setKeystrokeCount(0);
    if (timerRef.current) clearTimeout(timerRef.current);
    throttleRef.current = false;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant={mode === "debounce" ? "default" : "outline"} size="sm" onClick={() => setMode("debounce")}>Debounce</Button>
          <Button variant={mode === "throttle" ? "default" : "outline"} size="sm" onClick={() => setMode("throttle")}>Throttle</Button>
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Label className="whitespace-nowrap">Delay: {delay}ms</Label>
          <Slider value={[delay]} onValueChange={([v]) => setDelay(v)} min={50} max={2000} step={50} className="flex-1" />
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
      <Textarea
        placeholder="Start typing to see debounce/throttle in action..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        rows={4}
        className="bg-background font-mono"
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-xs text-muted-foreground">Keystrokes</p>
            <p className="text-2xl font-mono font-bold">{keystrokeCount}</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-xs text-muted-foreground">Triggers Fired</p>
            <p className="text-2xl font-mono font-bold text-primary">{triggerCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-3 pb-3 text-center">
            <p className="text-xs text-muted-foreground">Last Trigger</p>
            <p className="text-lg font-mono font-bold">{lastTrigger ?? "—"}</p>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">
        {mode === "debounce"
          ? `Debounce waits until ${delay}ms after the last keystroke before firing.`
          : `Throttle fires at most once every ${delay}ms while typing.`}
      </p>
      <SnippetSection snippets={[snippetDebounce, snippetThrottle]} />
    </div>
  );
}

/* ─────────────── 5) Object Tools ─────────────── */
function flattenObjectUtil(obj: any, prefix = ""): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObjectUtil(obj[key], path));
    } else {
      result[path] = obj[key];
    }
  }
  return result;
}

function sortKeysDeep(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sortKeysDeep);
  if (obj && typeof obj === "object") {
    return Object.keys(obj).sort().reduce((acc: any, key) => { acc[key] = sortKeysDeep(obj[key]); return acc; }, {});
  }
  return obj;
}

type ObjOp = "pick" | "omit" | "clone" | "flatten" | "sortKeys";

function ObjectTools() {
  const exampleJson = JSON.stringify({ user: { name: "Alice", age: 30, address: { city: "Bangkok", zip: "10110" } }, active: true, tags: ["dev", "admin"] }, null, 2);
  const [input, setInput] = useState(exampleJson);
  const [operation, setOperation] = useState<ObjOp>("flatten");
  const [fields, setFields] = useState("user.name, active");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const process = () => {
    try {
      const obj = JSON.parse(input);
      let output: any;
      switch (operation) {
        case "pick": {
          const keys = fields.split(",").map((s) => s.trim()).filter(Boolean);
          output = {};
          for (const k of keys) { const parts = k.split("."); let val = obj; for (const p of parts) { val = val?.[p]; } if (val !== undefined) output[k] = val; }
          break;
        }
        case "omit": {
          const keys = fields.split(",").map((s) => s.trim()).filter(Boolean);
          output = JSON.parse(JSON.stringify(obj));
          for (const k of keys) { const parts = k.split("."); let ref = output; for (let i = 0; i < parts.length - 1; i++) ref = ref?.[parts[i]]; if (ref) delete ref[parts[parts.length - 1]]; }
          break;
        }
        case "clone": output = structuredClone(obj); break;
        case "flatten": output = flattenObjectUtil(obj); break;
        case "sortKeys": output = sortKeysDeep(obj); break;
      }
      setResult(JSON.stringify(output, null, 2));
      setError("");
    } catch (e: any) { setError(e.message); setResult(""); }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>JSON Input</Label>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} className="font-mono text-xs bg-background" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Result</Label>
            {result && <CopyButton text={result} />}
          </div>
          {error ? (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive font-mono">{error}</div>
          ) : (
            <Textarea value={result} readOnly rows={10} className="font-mono text-xs bg-muted/30" />
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label>Operation</Label>
          <Select value={operation} onValueChange={(v) => setOperation(v as ObjOp)}>
            <SelectTrigger className="w-[180px] bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pick">Pick Fields</SelectItem>
              <SelectItem value="omit">Omit Fields</SelectItem>
              <SelectItem value="clone">Deep Clone</SelectItem>
              <SelectItem value="flatten">Flatten Object</SelectItem>
              <SelectItem value="sortKeys">Sort Keys</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(operation === "pick" || operation === "omit") && (
          <div className="space-y-1 flex-1 min-w-[200px]">
            <Label>Fields (comma-separated)</Label>
            <Input value={fields} onChange={(e) => setFields(e.target.value)} placeholder="e.g. user.name, active" className="bg-background font-mono" />
          </div>
        )}
        <Button onClick={process}>Run</Button>
      </div>
      <SnippetSection snippets={[snippetDeepClone, snippetFlatten, snippetIsEmpty, snippetRemoveNull, snippetGroupBy]} />
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */
const tabs = [
  { id: "date", label: "Date Formatter", icon: Calendar },
  { id: "currency", label: "Currency", icon: DollarSign },
  { id: "device", label: "Device Checker", icon: Monitor },
  { id: "debounce", label: "Debounce / Throttle", icon: Timer },
  { id: "object", label: "Object Tools", icon: Braces },
] as const;

export default function FrontendCoreUtilities() {
  return (
    <Tabs defaultValue="date" className="w-full">
      <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id} className="flex items-center gap-1.5 text-xs sm:text-sm">
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="mt-4">
        <TabsContent value="date"><DateFormatter /></TabsContent>
        <TabsContent value="currency"><CurrencyFormatter /></TabsContent>
        <TabsContent value="device"><DeviceChecker /></TabsContent>
        <TabsContent value="debounce"><DebounceThrottlePlayground /></TabsContent>
        <TabsContent value="object"><ObjectTools /></TabsContent>
      </div>
    </Tabs>
  );
}
