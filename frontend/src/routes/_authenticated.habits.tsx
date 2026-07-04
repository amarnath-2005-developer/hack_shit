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
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [saving, setSaving] = useState(false);

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const newHabit = await habitsService.create({
        name,
        description,
        frequency,
      });
      setData([newHabit, ...(data ?? [])]);
      setName("");
      setDescription("");
      setFrequency("daily");
      setShowForm(false);
    } catch {
      /* handled gracefully */
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Habits"
        title="Systems, not resolutions"
        description="Small daily reps compound into who you become."
        actions={
          <button 
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition"
          >
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

      {!loading && !error && showForm && (
        <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-6 max-w-xl border-cyan-500/20">
          <h3 className="text-lg font-medium text-white mb-4">Create New Habit</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Habit Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Read 30 mins, Gym, Drink 3L Water"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your ritual..."
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500 transition resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">Frequency</label>
              <div className="flex gap-2">
                {(["daily", "weekly"] as const).map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setFrequency(freq)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition ${
                      frequency === freq
                        ? "bg-white text-black"
                        : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-full text-xs font-semibold bg-cyan-accent text-black hover:bg-cyan-accent/90 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Create Habit"}
            </button>
          </div>
        </form>
      )}

      {!loading && !error && data && data.length === 0 && !showForm && (
        <EmptyState
          icon={Target}
          title="No habits yet"
          description="Pick one small daily action. Consistency > intensity."
          action={
            <button 
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-sm font-medium hover:bg-white/90 transition"
            >
              <Plus className="w-4 h-4" /> Create your first habit
            </button>
          }
        />
      )}

      {!loading && !error && data && (data.length > 0 || showForm) && (
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
