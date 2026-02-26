import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Menu, X, Wrench } from "lucide-react";
import { tools } from "../lib/tools";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link to="/" className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Wrench className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold text-foreground">DevToolbox</span>
        </Link>
        <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-3.5 lg:hidden text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        <nav aria-label="Tools" className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {tools.map((tool) => {
            const isActive = location.pathname === tool.path;
            return (
              <Link
                key={tool.id}
                to={tool.path}
                onClick={() => setMobileOpen(false)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <tool.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
                {tool.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-4 text-xs text-muted-foreground">
          All tools run locally in your browser.
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-3 border-b border-border px-4 lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-muted-foreground hover:text-foreground" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-muted-foreground">Developer Tools</span>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
