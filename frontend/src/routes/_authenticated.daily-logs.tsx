import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Plus } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { useApi } from "@/hooks/useApi";
import { dailyLogsService, type DailyLog } from "@/services/dailyLogs";

export const Route = createFileRoute("/_authenticated/daily-logs")({
  head: () => ({ meta: [{ title: "Daily Logs — DisciplineOS" }] }),
  component: DailyLogsPage,
});

function DailyLogsPage() {
  const { data, loading, error, refetch, setData } = useApi<DailyLog[]>(
    () => dailyLogsService.list(),
    [],
  );
  const [creating, setCreating] = useState(false);

  const addLog = async () => {
    setCreating(true);
    try {
      const created = await dailyLogsService.create({ date: new Date().toISOString() });
      setData([created, ...(data ?? [])]);
    } catch {
      /* handled by error state on next fetch */
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Daily Logs"
        title="Your daily record"
        description="Sleep, mood, focus and notes — the raw material of consistency."
        actions={
          <button
            onClick={addLog}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition disabled:opacity-60"
          >
            <Plus className="w-4 h-4" /> New log
          </button>
        }
      />

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          icon={CalendarDays}
          title="No logs yet"
          description="Log your first day to start seeing patterns."
          action={
            <button
              onClick={addLog}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition"
            >
              <Plus className="w-4 h-4" /> Log today
            </button>
          }
        />
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="space-y-3">
          {data.map((log) => (
            <div
              key={log._id}
              className="glass rounded-2xl p-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">
                  {new Date(log.date).toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                  <Stat label="Sleep" value={log.sleepHours != null ? `${log.sleepHours}h` : "—"} />
                  <Stat
                    label="Focus"
                    value={log.focusMinutes != null ? `${log.focusMinutes}m` : "—"}
                  />
                  <Stat label="Mood" value={log.mood != null ? `${log.mood}/10` : "—"} />
                </div>
                {log.notes && (
                  <p className="mt-2 text-sm text-muted-foreground truncate">{log.notes}</p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wide">Score</div>
                <div className="text-2xl font-semibold tracking-tight text-gradient">
                  {log.disciplineScore ?? "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span>
      <span className="text-muted-foreground/70">{label} </span>
      <span className="text-foreground">{value}</span>
    </span>
  );
}
