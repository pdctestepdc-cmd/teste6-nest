import { apiFetch } from "../lib/api";

const BASE = "/api/vendas";

export const vendasService = {
  list: () => apiFetch<unknown[]>(BASE),
  get: (id: string | number) => apiFetch<unknown>(`${BASE}/${id}`),
  create: (body: Record<string, unknown>) =>
    apiFetch<unknown>(BASE, { method: "POST", body: JSON.stringify(body) }),
  update: (id: string | number, body: Record<string, unknown>) =>
    apiFetch<unknown>(`${BASE}/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string | number) =>
    apiFetch<unknown>(`${BASE}/${id}`, { method: "DELETE" }),
};
