import { api } from "@/lib/axios";
import type { Material } from "../types";

function normalizeMaterialOne(payload: any): Material {
  return (payload?.data ?? payload) as Material;
}

export type BEVisibility = "HIDE" | "VISIBLE";

export type CreateMaterialPayload = {
  namaFile: string;
  tipe?: string;
  pathFile?: string;
  visibility?: BEVisibility;
  deskripsi?: string;
};

export type UpdateMaterialPayload = Partial<CreateMaterialPayload>;

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
    const body: Record<string, any> = {
      namaFile: payload.namaFile,
      tipe: payload.tipe ?? "",
      pathFile: payload.pathFile ?? "",
      visibility: payload.visibility ?? "VISIBLE",
    };

    if (payload.deskripsi && payload.deskripsi.trim() !== "") {
      body.deskripsi = { text: payload.deskripsi };
    }

    const res = await api.post<any>(
      `/materials/${idCourse}/meetings/${pertemuan}`,
      body
    );

    return normalizeMaterialOne(res.data);
  },

  async updateMaterial(
    idMaterial: string,
    payload: UpdateMaterialPayload
  ): Promise<void> {
    const body: Record<string, any> = {};

    if (payload.namaFile !== undefined) body.namaFile = payload.namaFile;
    if (payload.tipe !== undefined) body.tipe = payload.tipe;
    if (payload.pathFile !== undefined) body.pathFile = payload.pathFile;
    if (payload.visibility !== undefined) body.visibility = payload.visibility;
    if (payload.deskripsi !== undefined && payload.deskripsi.trim() !== "") {
      body.deskripsi = { text: payload.deskripsi };
    }

    await api.put(`/materials/${idMaterial}`, body);
  },

  async deleteMaterial(idMaterial: string): Promise<void> {
    await api.delete(`/materials/${idMaterial}`);
  },
};