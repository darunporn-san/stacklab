import { lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { I18nProvider } from "@/hooks/useI18n";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "./components/AppLayout";

const Index = lazy(() => import("./pages/Index"));
const JsonFormatterPage = lazy(() => import("./pages/JsonFormatterPage"));
const JwtDecoderPage = lazy(() => import("./pages/JwtDecoderPage"));
const Base64Page = lazy(() => import("./pages/Base64Page"));
const UriEncoderDecoderPage = lazy(() => import("./pages/UriEncoderDecoderPage"));
const RegexTesterPage = lazy(() => import("./pages/RegexTesterPage"));
const UuidGeneratorPage = lazy(() => import("./pages/UuidGeneratorPage"));
const TimestampConverterPage = lazy(() => import("./pages/TimestampConverterPage"));
const CurlToFetchPage = lazy(() => import("./pages/CurlToFetchPage"));
const JsonToTypescriptPage = lazy(() => import("./pages/JsonToTypescriptPage"));
const CaseConverterPage = lazy(() => import("./pages/CaseConverterPage"));
const SvgOptimizerPage = lazy(() => import("./pages/SvgOptimizerPage"));
const DiffCheckerPage = lazy(() => import("./pages/DiffCheckerPage"));
const AdvancedJsonDiffPage = lazy(() => import("./pages/AdvancedJsonDiffPage"));
const ImageConverterPage = lazy(() => import("./pages/ImageConverterPage"));
const ResponsivePlaygroundPage = lazy(() => import("./pages/ResponsivePlaygroundPage"));
const ResponsiveLayoutLabPage = lazy(() => import("./pages/ResponsiveLayoutLabPage"));
const JsonTreeViewerPage = lazy(() => import("./pages/JsonTreeViewerPage"));
const SmartJsonToTypescriptPage = lazy(() => import("./pages/SmartJsonToTypescriptPage"));
const RouteQuerySplitterPage = lazy(() => import("./pages/RouteQuerySplitterPage"));
const ColorCssUtilitiesPage = lazy(() => import("./pages/ColorCssUtilitiesPage"));
const FormValidationPage = lazy(() => import("./pages/FormValidationPage"));
const FrontendCoreUtilitiesPage = lazy(() => import("./pages/FrontendCoreUtilitiesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
              <Routes>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/json-formatter" element={<JsonFormatterPage />} />
                  <Route path="/json-tree-viewer" element={<JsonTreeViewerPage />} />
                  <Route path="/json-to-typescript" element={<JsonToTypescriptPage />} />
                  <Route path="/jwt-decoder" element={<JwtDecoderPage />} />
                  <Route path="/base64-encoder" element={<Base64Page />} />
                  <Route path="/uri-encoder-decoder" element={<UriEncoderDecoderPage />} />
                  <Route path="/regex-tester" element={<RegexTesterPage />} />
                  <Route path="/uuid-generator" element={<UuidGeneratorPage />} />
                  <Route path="/timestamp-converter" element={<TimestampConverterPage />} />
                  <Route path="/curl-to-fetch" element={<CurlToFetchPage />} />
                  <Route path="/case-converter" element={<CaseConverterPage />} />
                  <Route path="/svg-optimizer" element={<SvgOptimizerPage />} />
                  <Route path="/diff-checker" element={<DiffCheckerPage />} />
                  <Route path="/advanced-json-diff" element={<AdvancedJsonDiffPage />} />
                  <Route path="/image-converter" element={<ImageConverterPage />} />
                  <Route path="/responsive-playground" element={<ResponsivePlaygroundPage />} />
                  <Route path="/responsive-layout-lab" element={<ResponsiveLayoutLabPage />} />
                  <Route path="/smart-json-to-typescript" element={<SmartJsonToTypescriptPage />} />
                  <Route path="/route-query-splitter" element={<RouteQuerySplitterPage />} />
                  <Route path="/color-css-utilities" element={<ColorCssUtilitiesPage />} />
                  <Route path="/form-validation" element={<FormValidationPage />} />
                  <Route path="/frontend-core-utilities" element={<FrontendCoreUtilitiesPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
