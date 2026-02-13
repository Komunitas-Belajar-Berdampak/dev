import { api } from "@/lib/axios";
import type {
  TahunAkademikDanSemesterEntity,
  StatusTahunAkademikBE,
} from "../types/tahun-akademik-dan-semester";

export type CreateAcademicTermPayload = {
  periode: string;
  startDate: string;
  endDate: string;
  status: StatusTahunAkademikBE;
};

function normalizeAcademicTerms(payload: any): TahunAkademikDanSemesterEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

export const TahunAkademikDanSemesterService = {
  async getAll() {
    const res = await api.get<any>("/academic-terms");
    return normalizeAcademicTerms(res.data);
  },

  async getById(id: string) {
    const res = await api.get<any>(`/academic-terms/${id}`);
    return res.data?.data ?? res.data;
  },

  async create(payload: CreateAcademicTermPayload) {
    const res = await api.post<any>("/academic-terms", payload);
    return res.data?.data ?? res.data;
  },

  async deleteById(id: string) {
    const res = await api.delete<any>(`/academic-terms/${id}`);
    return res.data?.data ?? res.data;
  },
};
