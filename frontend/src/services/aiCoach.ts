import { api } from "./api";

export interface AIMessage {
  _id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export const aiCoachService = {
  history: () => api.get<AIMessage[]>("/ai/history").then((r) => r.data),
  send: (content: string) =>
    api.post<{ reply: AIMessage }>("/ai/chat", { content }).then((r) => r.data),
};
