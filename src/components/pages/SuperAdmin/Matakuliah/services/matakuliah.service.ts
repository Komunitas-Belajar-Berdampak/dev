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
  status: string;
  idPeriode: string;
  idMahasiswa?: string[];
  pengajar?: { id: string; nama: string }[];
  kelas: string;
  deskripsi?: string;
};

export type UpdateMatakuliahPayload = Partial<CreateMatakuliahPayload>;

function ensureMahasiswaArray(v: any): string[] {
  if (Array.isArray(v)) return v.filter(Boolean).map(String);
  return [];
}

function safeString(v: any): string {
  return String(v ?? "").trim();
}

export const MatakuliahService = {
  async getMatakuliah(): Promise<MatakuliahEntity[]> {
    const res = await api.get<any>("/courses");
    return normalizeMatakuliah(res.data);
  },

  async getMatakuliahById(id: string): Promise<MatakuliahEntity> {
    const res = await api.get<any>(`/courses/${id}`);
    return (res.data?.data ?? res.data) as MatakuliahEntity;
  },

  async createMatakuliah(payload: CreateMatakuliahPayload) {
    const apiPayload = {
      kodeMatkul: safeString(payload.kodeMatkul),
      namaMatkul: safeString(payload.namaMatkul),
      sks: Number(payload.sks),
      status: safeString(payload.status),
      idPeriode: safeString(payload.idPeriode),
      idMahasiswa: ensureMahasiswaArray(payload.idMahasiswa),
      pengajar: Array.isArray(payload.pengajar) ? payload.pengajar : [],
      kelas: safeString(payload.kelas),
      ...(payload.deskripsi !== undefined
        ? { deskripsi: safeString(payload.deskripsi) || null }
        : {}),
    };

    const res = await api.post<any>("/courses", apiPayload);
    return res.data?.data ?? res.data;
  },

  async updateMatakuliah(id: string, payload: UpdateMatakuliahPayload) {
    const apiPayload: any = {
      ...(payload.kodeMatkul !== undefined
        ? { kodeMatkul: safeString(payload.kodeMatkul) }
        : {}),
      ...(payload.namaMatkul !== undefined
        ? { namaMatkul: safeString(payload.namaMatkul) }
        : {}),
      ...(payload.sks !== undefined ? { sks: Number(payload.sks) } : {}),
      ...(payload.status !== undefined ? { status: safeString(payload.status) } : {}),
      ...(payload.idPeriode !== undefined ? { idPeriode: safeString(payload.idPeriode) } : {}),
      ...(payload.kelas !== undefined ? { kelas: safeString(payload.kelas) } : {}),
      ...(payload.idMahasiswa !== undefined
        ? { idMahasiswa: ensureMahasiswaArray(payload.idMahasiswa) }
        : {}),
      ...(payload.pengajar !== undefined
        ? { pengajar: Array.isArray(payload.pengajar) ? payload.pengajar : [] }
        : {}),
      ...(payload.deskripsi !== undefined
        ? { deskripsi: safeString(payload.deskripsi) || null }
        : {}),
    };

    const res = await api.put<any>(`/courses/${id}`, apiPayload);
    return res.data?.data ?? res.data;
  },

  async deleteMatakuliah(id: string) {
    const res = await api.delete<any>(`/courses/${id}`);
    return res.data?.data ?? res.data;
  },
};