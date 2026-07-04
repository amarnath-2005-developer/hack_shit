import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { LineChart as LineChartIcon } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Skeleton } from "@/components/common/Skeleton";
import { useApi } from "@/hooks/useApi";
import { analyticsService, type AnalyticsSummary } from "@/services/analytics";

const ranges = ["7d", "30d", "90d"] as const;
type Range = (typeof ranges)[number];

export const Route = createFileRoute("/_authenticated/analytics")({
  head: () => ({ meta: [{ title: "Analytics — DisciplineOS" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");
  const { data, loading, error, refetch } = useApi<AnalyticsSummary>(
    () => analyticsService.summary(range),
    [range],
  );

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Patterns you'd never catch manually"
        description="Zoom in on the metrics that predict your best weeks."
        actions={
          <div className="glass rounded-full p-1 flex items-center gap-1">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1 text-xs font-mono uppercase rounded-full transition ${
                  range === r
                    ? "bg-white text-black"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && data && (!data.weekly || data.weekly.length === 0) && (
        <EmptyState
          icon={LineChartIcon}
          title="Not enough data yet"
          description="Log a few days to unlock analytics."
        />
      )}

      {!loading && !error && data && data.weekly && data.weekly.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KPI
              label="Avg discipline"
              value={String(Math.round(data.averageDiscipline ?? 0))}
              suffix="/100"
            />
            <KPI label="Avg sleep" value={(data.averageSleep ?? 0).toFixed(1)} suffix="h" />
            <KPI
              label="Focus this month"
              value={`${Math.round((data.focusMinutesTotal ?? 0) / 60)}h`}
              suffix={`${(data.focusMinutesTotal ?? 0) % 60}m`}
            />
            <KPI label="Streak" value={String(data.streakDays ?? 0)} suffix="days" />
          </div>

          <div className="glass rounded-2xl p-6 mt-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
              Discipline trend
            </div>
            <TrendChart points={data.weekly.map((w) => w.disciplineScore)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
                Sleep hours
              </div>
              <TrendChart points={data.weekly.map((w) => w.sleepHours ?? 0)} color="cyan" />
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-4">
                Focus minutes
              </div>
              <TrendChart points={data.weekly.map((w) => w.focusMinutes ?? 0)} color="blue" />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function KPI({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-5"
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">
        {value}
        {suffix && <span className="ml-1 text-xs text-muted-foreground font-normal">{suffix}</span>}
      </div>
    </motion.div>
  );
}

function TrendChart({
  points,
  color = "purple",
}: {
  points: number[];
  color?: "purple" | "cyan" | "blue";
}) {
  if (points.length === 0) return null;
  const max = Math.max(...points, 1);
  const w = 100;
  const h = 30;
  const step = w / Math.max(points.length - 1, 1);
  const path = "M " + points.map((p, i) => `${i * step},${h - (p / max) * h}`).join(" L ");
  const area = path + ` L ${w},${h} L 0,${h} Z`;
  const gradId = `g-${color}`;
  const lineId = `l-${color}`;
  const colors = {
    purple: ["#a855f7", "#a855f7"],
    cyan: ["#22d3ee", "#22d3ee"],
    blue: ["#3b82f6", "#3b82f6"],
  }[color];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.4" />
          <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={lineId} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <motion.path
        d={path}
        stroke={`url(#${lineId})`}
        strokeWidth="1"
        fill="none"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
    </svg>
  );
}
