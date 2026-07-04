import { api } from "./api";

export interface DailyLog {
  _id: string;
  date: string;
  sleepHours?: number;
  mood?: number;
  focusMinutes?: number;
  notes?: string;
  disciplineScore?: number;
}

export const dailyLogsService = {
  list: (params?: { from?: string; to?: string }) =>
    api.get<DailyLog[]>("/daily-logs", { params }).then((r) => r.data),
  create: (payload: Partial<DailyLog>) =>
    api.post<DailyLog>("/daily-logs", payload).then((r) => r.data),
  update: (id: string, payload: Partial<DailyLog>) =>
    api.put<DailyLog>(`/daily-logs/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/daily-logs/${id}`).then((r) => r.data),
};
