import { api } from "@/lib/axios";
import type { ProgramStudiEntity } from "../types/program-studi";

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
    return res.data?.data ?? res.data;
  },
};
