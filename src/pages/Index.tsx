import { useState } from "react";
import { Braces, Key, Binary, Regex, Fingerprint, Clock, Terminal, Menu, X, Wrench } from "lucide-react";
import JsonFormatter from "../tools/JsonFormatter";
import JwtDecoder from "../tools/JwtDecoder";
import Base64Tool from "../tools/Base64Tool";
import RegexTester from "../tools/RegexTester";
import UuidGenerator from "../tools/UuidGenerator";
import TimestampConverter from "../tools/TimestampConverter";
import CurlToFetch from "../tools/CurlToFetch";

const tools = [
  { id: "json", label: "JSON Formatter", icon: Braces, component: JsonFormatter },
  { id: "jwt", label: "JWT Decoder", icon: Key, component: JwtDecoder },
  { id: "base64", label: "Base64", icon: Binary, component: Base64Tool },
  { id: "regex", label: "Regex Tester", icon: Regex, component: RegexTester },
  { id: "uuid", label: "UUID Generator", icon: Fingerprint, component: UuidGenerator },
  { id: "timestamp", label: "Timestamp", icon: Clock, component: TimestampConverter },
  { id: "curl", label: "Curl → Fetch", icon: Terminal, component: CurlToFetch },
];

const Index = () => {
  const [activeToolId, setActiveToolId] = useState("json");
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeTool = tools.find((t) => t.id === activeToolId)!;
  const ActiveComponent = activeTool.component;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Wrench className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">DevToolbox</h2>
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {tools.map((tool) => {
            const isActive = tool.id === activeToolId;
            return (
              <button
                key={tool.id}
                onClick={() => { setActiveToolId(tool.id); setMobileOpen(false); }}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <tool.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {tool.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          All tools run locally in your browser.
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-medium text-muted-foreground">{activeTool.label}</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ActiveComponent key={activeToolId} />
        </main>
      </div>
    </div>
  );
};

export default Index;
