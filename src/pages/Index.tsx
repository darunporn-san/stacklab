import { Link } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { tools } from "../lib/tools";

const Index = () => {
  return (
    <article className="animate-fade-in">
      <SeoHead
        title="Free Online Developer Tools"
        description="A collection of essential developer tools: JSON formatter, JWT decoder, Base64 encoder, regex tester, UUID generator, timestamp converter, and curl to fetch converter. All running locally in your browser."
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Developer Toolbox</h1>
        <p className="mt-2 text-muted-foreground">
          Free, fast, and private developer utilities. Everything runs locally in your browser — no data is ever sent to a server.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <div className="mt-0.5 rounded-lg bg-primary/10 p-2.5">
              <tool.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{tool.label}</h2>
              <p className="mt-1 text-xs text-muted-foreground">Open tool →</p>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
};

export default Index;
