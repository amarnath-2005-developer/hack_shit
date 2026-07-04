import { api } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level?: number;
  xp?: number;
}

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>("/auth/login", { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api
      .post<{ token: string; user: User }>("/auth/register", { name, email, password })
      .then((r) => r.data),
  me: () => api.get<User>("/auth/me").then((r) => r.data),
  logout: () =>
    api
      .post("/auth/logout")
      .then((r) => r.data)
      .catch(() => null),
};
