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

export type CreateMatakuliahPayload = {
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  kelas: string;
  status: "aktif" | "tidak aktif";

  // ✅ dari dropdown
  idPeriode: string;
  idPengajar: string;

  deskripsi?: string | null;
};

export type UpdateMatakuliahPayload = Partial<CreateMatakuliahPayload>;

export const MatakuliahService = {
  async getMatakuliah() {
    const res = await api.get<any>("/courses");
    return normalizeMatakuliah(res.data);
  },

  async getMatakuliahById(id: string) {
    const res = await api.get<any>(`/courses/${id}`);
    return res.data?.data ?? res.data;
  },

  async createMatakuliah(payload: CreateMatakuliahPayload) {
    const res = await api.post<any>("/courses", payload);
    return res.data?.data ?? res.data;
  },

  async updateMatakuliah(id: string, payload: UpdateMatakuliahPayload) {
    const res = await api.put<any>(`/courses/${id}`, payload);
    return res.data?.data ?? res.data;
  },

  async deleteMatakuliah(id: string) {
    const res = await api.delete<any>(`/courses/${id}`);
    return res.data?.data ?? res.data;
  },
};
