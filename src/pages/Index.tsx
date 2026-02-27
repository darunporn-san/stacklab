import { Link } from "react-router-dom";
import { SeoHead } from "../components/SeoHead";
import { tools } from "../lib/tools";
import { useTranslation } from "@/hooks/useI18n";

const Index = () => {
  const { t } = useTranslation();
  return (
    <article className="animate-fade-in">
      <SeoHead
        title={t("index.seoTitle")}
        description={t("index.seoDesc")}
      />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("index.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("index.subtitle")}</p>
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
              <h2 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">{t(tool.labelKey)}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{t("common.openTool")}</p>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
};

export default Index;
