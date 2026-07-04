import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 mb-8">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-accent mb-2">
            {eyebrow}
          </div>
        )}
        <h1 className="truncate text-3xl md:text-4xl font-semibold tracking-[-0.02em]">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
    </header>
  );
}
