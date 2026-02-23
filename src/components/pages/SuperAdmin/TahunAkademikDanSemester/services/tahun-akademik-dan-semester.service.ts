import { api } from "@/lib/axios";
import type {
  TahunAkademikDanSemesterEntity,
  StatusTahunAkademikBE,
  SemesterType,
} from "../types/tahun-akademik-dan-semester";

export type AcademicTermUpsertPayload = {
  periode: string;
  semesterType: SemesterType;
  semesters?: number[];
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
    return (res.data?.data ?? res.data) as TahunAkademikDanSemesterEntity;
  },

  async create(payload: AcademicTermUpsertPayload) {
    const res = await api.post<any>("/academic-terms", payload);
    return (res.data?.data ?? res.data) as TahunAkademikDanSemesterEntity;
  },

  async update(id: string, payload: AcademicTermUpsertPayload) {
    const res = await api.patch<any>(`/academic-terms/${id}`, payload);
    return (res.data?.data ?? res.data) as TahunAkademikDanSemesterEntity;
  },

  async deleteById(id: string) {
    const res = await api.delete<any>(`/academic-terms/${id}`);
    return res.data?.data ?? res.data;
  },
};