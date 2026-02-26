import { ReactNode } from "react";

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <div className="text-sm leading-relaxed text-muted-foreground space-y-2">{children}</div>
    </section>
  );
}
