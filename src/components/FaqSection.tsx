import { useTranslation } from "@/hooks/useI18n";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqSection({ items }: { items: FaqItem[] }) {
  const { t } = useTranslation();
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">{t("common.faq")}</h2>
      <dl className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4">
            <dt className="font-medium text-card-foreground">{item.q}</dt>
            <dd className="mt-1 text-sm text-muted-foreground">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
