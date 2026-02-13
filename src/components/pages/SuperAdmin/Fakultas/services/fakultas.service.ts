import { api } from "@/lib/axios";
import type { FakultasEntity, UpdateFakultasPayload } from "../types/fakultas";

function normalizeFakultas(payload: any): FakultasEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  return [];
}

export const FakultasService = {
  async getFakultas() {
    const res = await api.get("/faculties");
    return normalizeFakultas(res.data);
  },

  async getFakultasById(id: string) {
    const res = await api.get(`/faculties/${id}`);
    return res.data;
  },

  async createFakultas(payload: Partial<FakultasEntity>) {
    const res = await api.post("/faculties", payload);
    return res.data;
  },

  async updateFakultas(id: string, payload: UpdateFakultasPayload) {
    const res = await api.put<any>(`/faculties/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  async deleteFakultas(id: string) {
    const res = await api.delete(`/faculties/${id}`);
    return res.data;
  },
};
