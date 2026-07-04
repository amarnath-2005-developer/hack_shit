import { api } from "./api";

export interface Habit {
  _id: string;
  name: string;
  description?: string;
  frequency: "daily" | "weekly";
  targetPerWeek?: number;
  currentStreak?: number;
  bestStreak?: number;
  completedToday?: boolean;
  color?: string;
  icon?: string;
}

export const habitsService = {
  list: () => api.get<Habit[]>("/habits").then((r) => r.data),
  create: (payload: Partial<Habit>) => api.post<Habit>("/habits", payload).then((r) => r.data),
  update: (id: string, payload: Partial<Habit>) =>
    api.put<Habit>(`/habits/${id}`, payload).then((r) => r.data),
  remove: (id: string) => api.delete(`/habits/${id}`).then((r) => r.data),
  check: (id: string) => api.post(`/habits/${id}/check`).then((r) => r.data),
};

export interface BadHabit {
  _id: string;
  name: string;
  triggerCount?: number;
  cleanStreak?: number;
}

export const badHabitsService = {
  list: () => api.get<BadHabit[]>("/bad-habits").then((r) => r.data),
  create: (payload: Partial<BadHabit>) =>
    api.post<BadHabit>("/bad-habits", payload).then((r) => r.data),
  trigger: (id: string) => api.post(`/bad-habits/${id}/trigger`).then((r) => r.data),
  remove: (id: string) => api.delete(`/bad-habits/${id}`).then((r) => r.data),
};
