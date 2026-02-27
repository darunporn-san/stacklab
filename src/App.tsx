import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import JsonFormatterPage from "./pages/JsonFormatterPage";
import JwtDecoderPage from "./pages/JwtDecoderPage";
import Base64Page from "./pages/Base64Page";
import RegexTesterPage from "./pages/RegexTesterPage";
import UuidGeneratorPage from "./pages/UuidGeneratorPage";
import TimestampConverterPage from "./pages/TimestampConverterPage";
import CurlToFetchPage from "./pages/CurlToFetchPage";
import JsonToTypescriptPage from "./pages/JsonToTypescriptPage";
import CaseConverterPage from "./pages/CaseConverterPage";
import SvgOptimizerPage from "./pages/SvgOptimizerPage";
import DiffCheckerPage from "./pages/DiffCheckerPage";
import AdvancedJsonDiffPage from "./pages/AdvancedJsonDiffPage";
import ImageConverterPage from "./pages/ImageConverterPage";
import ResponsivePlaygroundPage from "./pages/ResponsivePlaygroundPage";
import ResponsiveLayoutLabPage from "./pages/ResponsiveLayoutLabPage";
import JsonTreeViewerPage from "./pages/JsonTreeViewerPage";
import SmartJsonToTypescriptPage from "./pages/SmartJsonToTypescriptPage";
import RouteQuerySplitterPage from "./pages/RouteQuerySplitterPage";
import ColorCssUtilitiesPage from "./pages/ColorCssUtilitiesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/json-formatter" element={<JsonFormatterPage />} />
              <Route path="/json-tree-viewer" element={<JsonTreeViewerPage />} />
              <Route path="/json-to-typescript" element={<JsonToTypescriptPage />} />
              <Route path="/jwt-decoder" element={<JwtDecoderPage />} />
              <Route path="/base64-encoder" element={<Base64Page />} />
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
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
