import { api } from "./api";
import type { User } from "./auth";

export interface Profile extends User {
  bio?: string;
  timezone?: string;
  joinedAt?: string;
}

export const profileService = {
  get: () => api.get<Profile>("/profile").then((r) => r.data),
  update: (payload: Partial<Profile>) => api.put<Profile>("/profile", payload).then((r) => r.data),
};

export interface UserSettings {
  notifications: { email: boolean; push: boolean; dailyReminder: boolean };
  theme: "dark" | "light" | "system";
  weekStart: "monday" | "sunday";
  aiCoachEnabled: boolean;
}

export const settingsService = {
  get: () => api.get<UserSettings>("/settings").then((r) => r.data),
  update: (payload: Partial<UserSettings>) =>
    api.put<UserSettings>("/settings", payload).then((r) => r.data),
};
