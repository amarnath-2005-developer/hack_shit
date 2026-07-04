import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flame, Sparkles, Target, Trophy, Zap, CheckCircle2, Circle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonCard, Skeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useApi } from "@/hooks/useApi";
import { dashboardService, type DashboardData } from "@/services/analytics";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — DisciplineOS" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, loading, error, refetch } = useApi<DashboardData>(() => dashboardService.get(), []);

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Today at a glance"
        description="Your discipline metrics, in real time."
      />

      {loading && <DashboardSkeleton />}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <StatTile
              icon={Flame}
              label="Discipline"
              value={String(data.disciplineScore ?? 0)}
              suffix="/100"
              className="md:col-span-2"
            />
            <StatTile
              icon={Zap}
              label="Streak"
              value={String(data.currentStreak ?? 0)}
              suffix="days"
              className="md:col-span-2"
            />
            <StatTile
              icon={Trophy}
              label="Level"
              value={String(data.level ?? 1)}
              suffix={`${data.levelProgress ?? 0}% to next`}
              className="md:col-span-2"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Weekly discipline
                  </div>
                  <div className="mt-1 text-3xl font-semibold tracking-tight">
                    {data.weekly?.at(-1)?.disciplineScore ?? "—"}
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>
                </div>
                <div className="text-xs font-mono text-cyan-accent">
                  XP {data.totalXP?.toLocaleString() ?? 0}
                </div>
              </div>
              {data.weekly && data.weekly.length > 0 ? (
                <WeeklyBars data={data.weekly} />
              ) : (
                <div className="text-sm text-muted-foreground py-8 text-center">
                  No data yet. Log a day to start your trend.
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-accent" />
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  AI Suggestions
                </div>
              </div>
              {data.aiSuggestions?.length ? (
                <ul className="space-y-3">
                  {data.aiSuggestions.map((s) => (
                    <li key={s._id} className="flex items-start justify-between gap-3">
                      <span className="text-sm leading-snug">{s.title}</span>
                      {s.impact && (
                        <span className="text-[10px] font-mono text-cyan-accent whitespace-nowrap mt-1">
                          {s.impact}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Your coach will drop insights here.
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-cyan-accent" />
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                Today's goals
              </div>
            </div>
            {data.todaysGoals?.length ? (
              <ul className="divide-y divide-white/5">
                {data.todaysGoals.map((g) => (
                  <li key={g._id} className="py-3 flex items-center gap-3">
                    {g.done ? (
                      <CheckCircle2 className="w-5 h-5 text-cyan-accent" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span
                      className={`text-sm ${g.done ? "line-through text-muted-foreground" : ""}`}
                    >
                      {g.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Target}
                title="No goals for today"
                description="Add a habit or plan tomorrow — DisciplineOS will surface goals here."
              />
            )}
          </div>
        </>
      )}
    </>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  suffix,
  className = "",
}: {
  icon: typeof Flame;
  label: string;
  value: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass rounded-2xl p-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <Icon className="w-4 h-4 text-cyan-accent" />
      </div>
      <div className="mt-4 text-3xl font-semibold tracking-tight">
        {value}
        {suffix && <span className="ml-2 text-xs text-muted-foreground font-normal">{suffix}</span>}
      </div>
    </motion.div>
  );
}

function WeeklyBars({ data }: { data: { date: string; disciplineScore: number }[] }) {
  const max = Math.max(100, ...data.map((d) => d.disciplineScore));
  return (
    <div>
      <div className="flex items-end gap-2 h-40">
        {data.map((d, i) => (
          <motion.div
            key={d.date}
            initial={{ height: 0 }}
            animate={{ height: `${(d.disciplineScore / max) * 100}%` }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 rounded-t-md bg-gradient-to-t from-purple-accent/70 to-cyan-accent/70 relative group"
          >
            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono transition">
              {d.disciplineScore}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted-foreground font-mono">
        {data.map((d) => (
          <span key={d.date}>
            {new Date(d.date).toLocaleDateString(undefined, { weekday: "short" }).slice(0, 1)}
          </span>
        ))}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="md:col-span-2">
            <SkeletonCard />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="glass rounded-2xl p-6 space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/6" />
        </div>
      </div>
    </>
  );
}
