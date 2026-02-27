const en = {
  // Common
  common: {
    copy: "Copy",
    copied: "Copied",
    reset: "Reset",
    loadExample: "Load Example",
    generate: "Generate",
    encode: "Encode",
    decode: "Decode",
    valid: "Valid",
    invalid: "Invalid",
    openTool: "Open tool →",
    allLocal: "All tools run locally in your browser.",
    devTools: "Developer Tools",
    otherTools: "Other Developer Tools",
    faq: "Frequently Asked Questions",
    whatIsIt: "What is it?",
    howToUse: "How to Use",
    example: "Example",
    features: "Features",
    supportedFormats: "Supported Formats",
    noDataSent: "No. Everything runs locally in your browser. No data is ever sent to any server.",
    returnHome: "Return to Home",
    pageNotFound: "Oops! Page not found",
  },
  // Navigation / Categories
  nav: {
    jsonData: "JSON & Data",
    encodingSecurity: "Encoding & Security",
    comparisonTools: "Comparison Tools",
    apiNetwork: "API & Network",
    textCode: "Text & Code",
    converters: "Converters",
    colorCss: "Color & CSS",
    responsiveDesign: "Responsive Design",
  },
  // Tool names
  tools: {
    jsonTreeViewer: "JSON Tree Viewer",
    smartJsonTs: "JSON → TS Pro",
    jwtDecoder: "JWT Decoder",
    base64Encoder: "Base64 Encoder",
    uuidGenerator: "UUID Generator",
    advancedJsonDiff: "Advanced JSON Diff",
    routeQuerySplitter: "Route & Query Splitter",
    regexTester: "Regex Tester",
    caseConverter: "Case Converter",
    timestampConverter: "Timestamp Converter",
    svgOptimizer: "SVG Optimizer",
    imageConverter: "Image Converter",
    colorCssUtilities: "Color & CSS Utilities",
    responsivePlayground: "Responsive Playground",
    layoutLab: "Layout Lab",
  },
  // Index page
  index: {
    title: "Developer Toolbox",
    subtitle: "Free, fast, and private developer utilities. Everything runs locally in your browser — no data is ever sent to a server.",
    seoTitle: "Free Online Developer Tools",
    seoDesc: "A collection of essential developer tools: JSON formatter, JWT decoder, Base64 encoder, regex tester, UUID generator, timestamp converter. All running locally in your browser.",
  },
  // Base64
  base64: {
    title: "Base64 Encoder & Decoder",
    subtitle: "Encode text to Base64 or decode Base64 strings instantly.",
    seoDesc: "Encode and decode Base64 strings online. Supports UTF-8 text. Free, fast, and runs entirely in your browser.",
    whatIs: "Base64 is a binary-to-text encoding scheme that represents binary data as ASCII characters. It's commonly used for embedding data in URLs, emails, HTML, and JSON payloads.",
    howTo1: "1. Enter plain text to encode, or a Base64 string to decode.",
    howTo2: "2. Click Encode or Decode.",
    howTo3: "3. Copy the result with the copy button.",
    faqEncrypt: "Does Base64 encrypt data?",
    faqEncryptA: "No. Base64 is an encoding scheme, not encryption. Anyone can decode a Base64 string.",
    faqUnicode: "Does it support Unicode/UTF-8?",
    faqUnicodeA: "Yes. This tool handles UTF-8 text correctly by encoding/decoding through URI component conversion.",
    faqSize: "Is there a size limit?",
    faqSizeA: "No hard limit — it runs in your browser, so it depends on available memory.",
  },
  // JWT
  jwt: {
    title: "JWT Decoder",
    subtitle: "Decode and inspect JSON Web Tokens without sending data to any server.",
    seoDesc: "Decode and inspect JWT tokens online. View header, payload, and expiration dates. Runs locally in your browser.",
    whatIs: "A JSON Web Token (JWT) is a compact, URL-safe token format used for securely transmitting claims between parties. It consists of three Base64URL-encoded parts: header, payload, and signature.",
    howTo1: "1. Paste your JWT token — it decodes automatically.",
    howTo2: "2. Switch between Header, Payload, and Signature tabs.",
    howTo3: "3. View the live expiry countdown and timezone-converted timestamps.",
    howTo4: "4. Search, copy individual claims, or copy the entire payload.",
    howTo5: "5. Optionally validate the signature using your secret key or public key.",
  },
  // UUID
  uuid: {
    title: "UUID Generator",
    subtitle: "Generate cryptographically random v4 UUIDs instantly.",
    seoDesc: "Generate random v4 UUIDs online. Create single or bulk UUIDs instantly. Copy to clipboard with one click.",
    whatIs: "A Universally Unique Identifier (UUID) is a 128-bit identifier that is unique across space and time. Version 4 UUIDs are randomly generated using cryptographically secure random number generators.",
    howTo1: "1. Select how many UUIDs to generate (1–50).",
    howTo2: "2. Click Generate.",
    howTo3: "3. Click Copy on any individual UUID or copy all at once.",
  },
  // Timestamp
  timestamp: {
    title: "Unix Timestamp Converter",
    subtitle: "Convert between Unix timestamps and human-readable dates.",
    seoDesc: "Convert Unix timestamps to human-readable dates and vice versa. Auto-detects seconds vs milliseconds.",
    whatIs: "A Unix timestamp (also called Epoch time) is the number of seconds that have elapsed since January 1, 1970 00:00:00 UTC. It's widely used in programming, databases, and APIs.",
    howTo1: "1. Enter a Unix timestamp to convert to a readable date, or use the date picker.",
    howTo2: "2. The tool auto-detects whether your input is in seconds or milliseconds.",
    howTo3: "3. Both local time and UTC are displayed.",
    howTo4: "4. Click Now to insert the current timestamp.",
  },
  // Regex
  regex: {
    title: "Regex Tester",
    subtitle: "Test and debug regular expressions with real-time match highlighting.",
    seoDesc: "Test regular expressions with real-time match highlighting and build validation rules visually. Free online regex tool.",
    pattern: "Pattern",
    testString: "Test String",
    matchesFound: "match(es) found",
    unicodeMode: "Unicode mode",
    matchDetails: "Match Details",
    ruleBuilder: "Rule Builder 🔥",
    thaiMode: "Thai Mode 🇹🇭",
  },
  // Smart JSON to TS
  smartJsonTs: {
    title: "Smart JSON → TypeScript Pro",
    subtitle: "Production-grade type inference engine — interfaces, types, Zod schemas, and JSON Schema from any JSON.",
    seoDesc: "Production-grade JSON to TypeScript generator with union types, nullable detection, enum inference, Zod schemas.",
    whatIs: "Unlike basic converters, this engine merges array object structures, detects nullable and optional fields, infers string literal unions, identifies enum candidates, and generates multiple output formats.",
  },
  // Advanced JSON Diff
  jsonDiff: {
    title: "Advanced JSON Diff",
    subtitle: "Deep structural comparison with tree visualization, array strategies, and change inspector.",
    seoDesc: "Compare JSON structures with tree diff, array matching strategies, and a professional change inspector.",
    whatIs: "A professional-grade JSON comparison tool that goes beyond line-by-line diffing. It parses JSON structurally, compares nested objects and arrays with configurable strategies.",
  },
  // Case Converter
  caseConverter: {
    title: "Case Converter",
    subtitle: "Convert text between camelCase, snake_case, kebab-case, and 8 more formats instantly.",
    seoDesc: "Convert text between camelCase, PascalCase, snake_case, kebab-case, and more. Free browser-based developer tool.",
    whatIs: "A case converter transforms text between common naming conventions used in programming — such as camelCase for JavaScript, snake_case for Python, kebab-case for CSS.",
  },
  // SVG
  svg: {
    title: "SVG Optimizer",
    subtitle: "Optimize SVGs and generate framework-ready components instantly.",
    seoDesc: "Optimize SVG files and convert them to React, Vue, or inline HTML components. All in-browser.",
    whatIs: "A browser-based tool that cleans, minifies, and converts raw SVG markup into production-ready React, Vue, or HTML components — with live preview.",
  },
  // Image Converter
  imageConverter: {
    title: "Image Converter",
    subtitle: "Resize, convert formats, and generate Base64 or code snippets from any image.",
    seoDesc: "Convert, resize, and optimize images to WebP, PNG, or JPEG. Generate Base64 strings and code snippets.",
    whatIs: "A browser-based tool for frontend developers to quickly resize images, convert formats, generate Base64 data URLs, and create ready-to-use code snippets.",
  },
  // Color CSS
  colorCss: {
    title: "Color & CSS Utilities",
    seoDesc: "Free online Color Converter, CSS Gradient Generator, Box Shadow Builder, Clamp Calculator and Tailwind Color Matcher.",
  },
  // Route Query
  routeQuery: {
    title: "Route & Query Splitter",
    seoDesc: "Parse URLs into structured components — extract path parameters, query parameters, protocol, host, and more.",
  },
  // Responsive
  responsive: {
    playgroundTitle: "Responsive Playground",
    playgroundSubtitle: "Preview websites across screen sizes with real-time breakpoint visualization.",
    playgroundSeoDesc: "Preview any website across multiple screen sizes. Visualize Tailwind breakpoints and test device presets.",
    labTitle: "Responsive Layout Lab",
    labSubtitle: "Visually build Flexbox & Grid layouts with responsive breakpoints — export clean code instantly.",
    labSeoDesc: "Visually build responsive Flexbox and Grid layouts with per-breakpoint configuration. Export production-ready CSS and Tailwind.",
  },
  // JSON Tree
  jsonTree: {
    title: "JSON Tree Viewer",
    subtitle: "Interactive JSON explorer with collapsible tree, search, and inspector panel.",
  },
  // 404
  notFound: {
    title: "404",
    message: "Oops! Page not found",
    returnHome: "Return to Home",
  },
};

export default en;
export type Translations = typeof en;
