import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Copy, Globe, FolderTree, Search, ChevronDown, FileJson, Zap } from "lucide-react";
import { parseUrl } from "@/lib/urlParser";
import { useToast } from "@/hooks/use-toast";

const EXAMPLE_URL = "https://api.example.com/v1/users/${userId}/posts/:postId?page=2&limit=10&active=true&tag=null&search=hello+world";

export default function RouteQuerySplitter() {
  const [url, setUrl] = useState("");
  const [showTypes, setShowTypes] = useState(true);
  const [jsonOpen, setJsonOpen] = useState(false);
  const { toast } = useToast();

  const parsed = useMemo(() => parseUrl(url), [url]);

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard` });
  };

  const copyAsJson = () => {
    copyText(JSON.stringify(parsed, null, 2), "Parsed result");
  };

  const hasInput = url.trim().length > 0;

  return (
    <ToolLayout title="Route & Query Splitter" description="Parse URLs into structured components — path params, query params, and more.">
      {/* Input */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Paste URL here... e.g. /api/users/:id?page=1&limit=10"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="font-mono text-sm"
            />
            <Button variant="outline" size="sm" onClick={() => setUrl(EXAMPLE_URL)}>
              <Zap className="h-3.5 w-3.5 mr-1" /> Example
            </Button>
            {hasInput && (
              <Button variant="ghost" size="sm" onClick={() => setUrl("")}>
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
                <Globe className="h-4 w-4 text-primary" /> URL Breakdown
                <Button variant="ghost" size="icon" className="ml-auto h-7 w-7" onClick={() => copyText(`${parsed.protocol ? parsed.protocol + "://" : ""}${parsed.host}${parsed.fullPath}${parsed.rawQuery ? "?" + parsed.rawQuery : ""}`, "URL")}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  { label: "Protocol", value: parsed.protocol || "—" },
                  { label: "Host", value: parsed.host || "—" },
                  { label: "Full Path", value: parsed.fullPath || "—" },
                  { label: "Raw Query", value: parsed.rawQuery || "—" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                    <div className="font-mono text-xs bg-muted/50 rounded-md px-3 py-2 break-all">{item.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
