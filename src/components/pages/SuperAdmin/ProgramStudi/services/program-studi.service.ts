import { api } from "@/lib/axios";
import type { ProgramStudiEntity } from "../types/program-studi";

export type CreateProgramStudiPayload = {
  kodeProdi: string;
  namaProdi: string;
  idFakultas: string;
};

export type UpdateProgramStudiPayload = {
  namaProdi?: string;
  idFakultas?: string;
};

function normalizeProgramStudi(payload: any): ProgramStudiEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export const ProgramStudiService = {
  async getProgramStudi() {
    const res = await api.get<any>("/majors");
    return normalizeProgramStudi(res.data);
  },

  async getProgramStudiById(id: string) {
    const res = await api.get<any>(`/majors/${id}`);
    return (res.data?.data ?? res.data) as ProgramStudiEntity;
  },

  async createProgramStudi(payload: CreateProgramStudiPayload) {
    const res = await api.post<any>("/majors", payload);
    return res.data?.data ?? res.data;
  },

  async updateProgramStudi(id: string, payload: UpdateProgramStudiPayload) {
    const res = await api.put<any>(`/majors/${id}`, payload);
    return res.data?.data ?? res.data;
  },
};
