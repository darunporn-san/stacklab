import { Link } from "react-router-dom";
import { tools } from "../lib/tools";
import { useTranslation } from "@/hooks/useI18n";

interface RelatedToolsProps {
  currentId: string;
}

export function RelatedTools({ currentId }: RelatedToolsProps) {
  const { t } = useTranslation();
  const others = tools.filter((t) => t.id !== currentId);
  return (
    <nav aria-label="Related tools" className="mt-10 border-t border-border pt-8">
      <h2 className="mb-4 text-lg font-semibold">{t("common.otherTools")}</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm font-medium text-card-foreground transition-colors hover:bg-muted"
          >
            <tool.icon className="h-4 w-4 text-primary" />
            {t(tool.labelKey)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
