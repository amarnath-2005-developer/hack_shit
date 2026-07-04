import { api } from "./api";

export interface WeeklyPoint {
  date: string;
  disciplineScore: number;
  sleepHours?: number;
  focusMinutes?: number;
}

export interface AnalyticsSummary {
  weekly: WeeklyPoint[];
  averageDiscipline: number;
  averageSleep: number;
  focusMinutesTotal: number;
  streakDays: number;
}

export const analyticsService = {
  summary: (range: "7d" | "30d" | "90d" = "30d") =>
    api.get<AnalyticsSummary>("/analytics", { params: { range } }).then((r) => r.data),
};

export interface DashboardData {
  disciplineScore: number;
  currentStreak: number;
  totalXP: number;
  level: number;
  levelProgress: number;
  todaysGoals: { _id: string; title: string; done: boolean }[];
  aiSuggestions: { _id: string; title: string; impact?: string }[];
  weekly: WeeklyPoint[];
}

export const dashboardService = {
  get: () => api.get<DashboardData>("/dashboard").then((r) => r.data),
};
