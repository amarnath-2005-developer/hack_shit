import { createFileRoute } from "@tanstack/react-router";
import { Check, Flame, Plus, Target } from "lucide-react";
import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { useApi } from "@/hooks/useApi";
import { habitsService, type Habit } from "@/services/habits";

export const Route = createFileRoute("/_authenticated/habits")({
  head: () => ({ meta: [{ title: "Habits — DisciplineOS" }] }),
  component: HabitsPage,
});

function HabitsPage() {
  const { data, loading, error, refetch, setData } = useApi<Habit[]>(
    () => habitsService.list(),
    [],
  );
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (h: Habit) => {
    setBusy(h._id);
    try {
      await habitsService.check(h._id);
      setData(
        (data ?? []).map((x) =>
          x._id === h._id
            ? {
                ...x,
                completedToday: !x.completedToday,
                currentStreak: (x.currentStreak ?? 0) + (x.completedToday ? -1 : 1),
              }
            : x,
        ),
      );
    } catch {
      /* ignore, refetch on next mount */
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Habits"
        title="Systems, not resolutions"
        description="Small daily reps compound into who you become."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition">
            <Plus className="w-4 h-4" /> New habit
          </button>
        }
      />

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          icon={Target}
          title="No habits yet"
          description="Pick one small daily action. Consistency > intensity."
          action={
            <button className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition">
              <Plus className="w-4 h-4" /> Create your first habit
            </button>
          }
        />
      )}

      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((h) => (
            <div key={h._id} className="glass rounded-2xl p-5 flex items-start gap-4">
              <button
                onClick={() => toggle(h)}
                disabled={busy === h._id}
                className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition ${
                  h.completedToday
                    ? "bg-gradient-to-br from-purple-accent to-cyan-accent text-black"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground"
                }`}
                aria-label={h.completedToday ? "Uncheck" : "Check"}
              >
                <Check className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-medium truncate">{h.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-cyan-accent font-mono shrink-0">
                    <Flame className="w-3.5 h-3.5" />
                    {h.currentStreak ?? 0}d
                  </div>
                </div>
                {h.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{h.description}</p>
                )}
                <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground font-mono uppercase">
                  <span>{h.frequency}</span>
                  {h.bestStreak != null && <span>· best {h.bestStreak}d</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
