import { api } from "@/lib/axios";
import type { Material, BEStatus } from "../types";

function normalizeMaterialOne(payload: any): Material {
  return (payload?.data ?? payload) as Material;
}

export type CreateMaterialPayload = {
  file: File;
  namaFile?: string;
  status?: BEStatus;
  deskripsi?: any;
  tipe?: string;
};

export const MaterialService = {
  async getMaterialsByCourse(idCourse: string): Promise<Material[]> {
    const res = await api.get<any>(`/materials/${idCourse}`);
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  },

  async createMaterialByCourseMeeting(
    idCourse: string,
    pertemuan: number,
    payload: CreateMaterialPayload
  ): Promise<Material> {
    const form = new FormData();

    form.append("file", payload.file);

    if (payload.namaFile) form.append("namaFile", payload.namaFile);
    if (payload.status) form.append("status", payload.status);
    if (payload.tipe) form.append("tipe", payload.tipe);

    if (payload.deskripsi !== undefined) {
      form.append(
        "deskripsi",
        typeof payload.deskripsi === "string"
          ? payload.deskripsi
          : JSON.stringify(payload.deskripsi)
      );
    }

    const res = await api.post<any>(
      `/materials/${idCourse}/meetings/${pertemuan}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return normalizeMaterialOne(res.data);
  },
};