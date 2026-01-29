import { api } from "@/lib/axios";
import type { MatakuliahEntity } from "../types/matakuliah";

function normalizeMatakuliah(payload: any): MatakuliahEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export const MatakuliahService = {
  async getMatakuliah() {
    const res = await api.get<any>("/courses");
    return normalizeMatakuliah(res.data);
  },

  async getMatakuliahById(id: string) {
    const res = await api.get<any>(`/courses/${id}`);
    return res.data?.data ?? res.data;
  },
};
