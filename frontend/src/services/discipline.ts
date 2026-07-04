import { api } from "./api";

export const dashboardService = {
  getSummary: () => api.get("/dashboard").then((r) => r.data),
};

export const habitsService = {
  list: () => api.get("/habits").then((r) => r.data),
};

export const analyticsService = {
  weekly: () => api.get("/analytics/weekly").then((r) => r.data),
};

export const aiService = {
  chat: (message: string) => api.post("/ai/chat", { message }).then((r) => r.data),
};
