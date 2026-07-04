import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-10 text-center flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-accent/30 to-cyan-accent/20 p-[1px]">
        <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="mt-5 text-lg font-medium tracking-tight">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
