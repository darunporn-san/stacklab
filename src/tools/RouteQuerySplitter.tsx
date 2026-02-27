import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Globe, FolderTree, Search, ChevronDown, FileJson, Zap, Code2, Terminal, Link } from "lucide-react";
import { parseInput, type InputMode, type ParsedInput } from "@/lib/curlParser";
import { buildBaseUrl, generateFetchURLSearchParams, generateFetchURL, generateAxiosCode } from "@/lib/queryCodeGenerator";
import { CopyButton } from "@/components/CopyButton";
import { useToast } from "@/hooks/use-toast";

const EXAMPLE_URL = "https://api.example.com/v1/users/${userId}/posts/:postId?page=2&limit=10&active=true&tag=null&search=hello+world";

const EXAMPLE_CURL = `curl -X GET "https://uat-ofm.ofm.co.th/category/123?sort=new_arrivals&perPage=60" \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9" \\
  -H "Accept: application/json"`;

export default function RouteQuerySplitter() {
  const [input, setInput] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("auto");
  const [showTypes, setShowTypes] = useState(true);
  const [jsonOpen, setJsonOpen] = useState(false);
  const { toast } = useToast();

  const parsed = useMemo(() => parseInput(input, inputMode), [input, inputMode]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const copyAsJson = () => {
    copyText(JSON.stringify(parsed, null, 2), "Parsed result");
  };

  const hasInput = input.trim().length > 0;
  const hasHeaders = Object.keys(parsed.headers).length > 0;

  return (
    <ToolLayout title="Route & Query Splitter" description="Parse URLs and cURL commands into structured components — path params, query params, headers, and more.">
      {/* Input */}
      <Card>
        <CardContent className="pt-6 space-y-3">
          {/* Input Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Mode:</span>
            {(["auto", "url", "curl"] as InputMode[]).map((mode) => (
              <Button
                key={mode}
                variant={inputMode === mode ? "default" : "outline"}
                size="sm"
                className="h-7 text-xs capitalize"
                onClick={() => setInputMode(mode)}
              >
                {mode === "auto" && "⚡ Auto"}
                {mode === "url" && <><Link className="h-3 w-3 mr-1" />URL</>}
                {mode === "curl" && <><Terminal className="h-3 w-3 mr-1" />cURL</>}
              </Button>
            ))}
            {hasInput && parsed.inputType && (
              <Badge variant="outline" className="ml-2 text-xs">
                Detected: {parsed.inputType.toUpperCase()}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder={inputMode === "curl"
                ? 'Paste cURL command here... e.g. curl -X GET "https://api.example.com/users?page=1" -H "Authorization: Bearer token"'
                : "Paste URL or cURL command here... e.g. /api/users/:id?page=1&limit=10"
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="font-mono text-sm min-h-[60px] resize-y"
              rows={input.includes("\n") ? 4 : 2}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setInput(EXAMPLE_URL)}>
              <Zap className="h-3.5 w-3.5 mr-1" /> URL Example
            </Button>
            <Button variant="outline" size="sm" onClick={() => setInput(EXAMPLE_CURL)}>
              <Terminal className="h-3.5 w-3.5 mr-1" /> cURL Example
            </Button>
            {hasInput && (
              <Button variant="ghost" size="sm" onClick={() => setInput("")}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {hasInput && (
        <>
          {/* URL Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" /> Parsed Overview
                <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => copyText(`${parsed.protocol ? parsed.protocol + "://" : ""}${parsed.host}${parsed.fullPath}${parsed.rawQuery ? "?" + parsed.rawQuery : ""}`, "URL")}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {[
                  { label: "Method", value: parsed.method },
                  { label: "Protocol", value: parsed.protocol || "—" },
                  { label: "Host", value: parsed.host || "—" },
                  { label: "Full Path", value: parsed.fullPath || "—" },
                  { label: "Raw Query", value: parsed.rawQuery || "—" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                    <div className="font-mono text-xs bg-muted/50 rounded-md px-3 py-2 break-all">
                      {item.label === "Method" ? (
                        <Badge variant={item.value === "GET" ? "secondary" : "default"} className="text-xs">
                          {item.value}
                        </Badge>
                      ) : item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Headers (only if present) */}
          {hasHeaders && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-primary" /> Headers
                  <Badge variant="secondary" className="ml-1">{Object.keys(parsed.headers).length}</Badge>
                  <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => copyText(JSON.stringify(parsed.headers, null, 2), "Headers")}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Key</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(parsed.headers).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs font-medium">{key}</td>
                          <td className="py-2 font-mono text-xs break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Body (only if present) */}
          {parsed.body && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileJson className="h-4 w-4 text-primary" /> Request Body
                  <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => copyText(parsed.body!, "Body")}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="font-mono text-xs bg-muted/50 rounded-md p-4 overflow-x-auto whitespace-pre-wrap break-all">
                  {parsed.body}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Path Parameters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderTree className="h-4 w-4 text-primary" /> Path Parameters
                {parsed.pathParams.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{parsed.pathParams.length}</Badge>
                )}
                {parsed.pathParams.length > 0 && (
                  <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => copyText(JSON.stringify(parsed.pathParams, null, 2), "Path params")}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parsed.pathParams.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No dynamic path parameters detected.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Key</th>
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Pattern</th>
                        <th className="pb-2 text-xs font-medium text-muted-foreground">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.pathParams.map((p, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{p.key}</td>
                          <td className="py-2 pr-4 font-mono text-xs text-primary">{p.pattern}</td>
                          <td className="py-2"><Badge variant="outline" className="text-xs">{p.type}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Query Parameters */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" /> Query Parameters
                {parsed.queryParams.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{parsed.queryParams.length}</Badge>
                )}
                {parsed.queryParams.length > 0 && (
                  <>
                    <Button variant="outline" size="sm" className="ml-auto h-7 text-xs" onClick={() => setShowTypes(!showTypes)}>
                      {showTypes ? "Hide" : "Show"} Types
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyText(JSON.stringify(parsed.queryParams, null, 2), "Query params")}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {parsed.queryParams.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No query parameters found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Key</th>
                        <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">Value</th>
                        {showTypes && <th className="pb-2 text-xs font-medium text-muted-foreground">Detected Type</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.queryParams.map((q, i) => (
                        <tr key={i} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-mono text-xs">{q.key}</td>
                          <td className="py-2 pr-4 font-mono text-xs">{q.value}</td>
                          {showTypes && (
                            <td className="py-2">
                              <Badge variant={q.detectedType === "string" ? "secondary" : q.detectedType === "number" ? "default" : "outline"} className="text-xs">
                                {q.detectedType}
                              </Badge>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Query Code Generator */}
          {parsed.queryParams.length > 0 && (() => {
            const baseUrl = buildBaseUrl(parsed.protocol, parsed.host, parsed.fullPath);
            const fetchParamsCode = generateFetchURLSearchParams(baseUrl, parsed.queryParams, parsed.method, parsed.headers);
            const fetchUrlCode = generateFetchURL(baseUrl, parsed.queryParams, parsed.method, parsed.headers);
            const axiosCode = generateAxiosCode(baseUrl, parsed.queryParams, parsed.method, parsed.headers);
            return (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" /> Query Code Generator
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="fetch">
                    <TabsList className="mb-3">
                      <TabsTrigger value="fetch">Fetch</TabsTrigger>
                      <TabsTrigger value="axios">Axios</TabsTrigger>
                    </TabsList>
                    <TabsContent value="fetch">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">URLSearchParams</p>
                          <div className="rounded-lg border border-border bg-muted/50">
                            <pre className="font-mono text-xs p-4 overflow-x-auto whitespace-pre-wrap break-all">
                              {fetchParamsCode}
                            </pre>
                            <div className="flex justify-end border-t border-border px-3 py-2">
                              <CopyButton text={fetchParamsCode} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">new URL()</p>
                          <div className="rounded-lg border border-border bg-muted/50">
                            <pre className="font-mono text-xs p-4 overflow-x-auto whitespace-pre-wrap break-all">
                              {fetchUrlCode}
                            </pre>
                            <div className="flex justify-end border-t border-border px-3 py-2">
                              <CopyButton text={fetchUrlCode} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="axios">
                      <div className="rounded-lg border border-border bg-muted/50">
                        <pre className="font-mono text-xs p-4 overflow-x-auto whitespace-pre-wrap break-all">
                          {axiosCode}
                        </pre>
                        <div className="flex justify-end border-t border-border px-3 py-2">
                          <CopyButton text={axiosCode} />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            );
          })()}

          {/* Raw JSON */}
          <Card>
            <Collapsible open={jsonOpen} onOpenChange={setJsonOpen}>
              <CardHeader className="pb-3">
                <CollapsibleTrigger asChild>
                  <CardTitle className="text-base flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <FileJson className="h-4 w-4 text-primary" /> Raw JSON
                    <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${jsonOpen ? "rotate-180" : ""}`} />
                  </CardTitle>
                </CollapsibleTrigger>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={copyAsJson}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <pre className="font-mono text-xs bg-muted/50 rounded-md p-4 overflow-x-auto max-h-80">
                      {JSON.stringify(parsed, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        </>
      )}
    </ToolLayout>
  );
}
