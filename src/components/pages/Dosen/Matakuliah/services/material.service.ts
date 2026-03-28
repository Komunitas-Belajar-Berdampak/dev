import { api } from "@/lib/axios";
import type { Material } from "../types";

function normalizeMaterialOne(payload: any): Material {
  return (payload?.data ?? payload) as Material;
}

export type BEVisibility = "HIDE" | "VISIBLE";

export type CreateMaterialPayload = {
  file: File;                        // file wajib saat create
  namaFile?: string;                 // opsional, fallback ke file.name
  visibility?: BEVisibility;
  deskripsi?: string;
};

export type UpdateMaterialPayload = {
  file?: File;                       // opsional saat update
  namaFile?: string;
  visibility?: BEVisibility;
  deskripsi?: string;
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

    // BE mengambil file via req.file dengan field name "file"
    form.append("file", payload.file);

    // namaFile opsional — BE fallback ke req.file.originalname
    if (payload.namaFile?.trim()) {
      form.append("namaFile", payload.namaFile.trim());
    }

    form.append("visibility", payload.visibility ?? "VISIBLE");

    // deskripsi harus JSON string karena BE pakai parseJsonField
    if (payload.deskripsi?.trim()) {
      form.append("deskripsi", JSON.stringify({ text: payload.deskripsi.trim() }));
    }

    const res = await api.post<any>(
      `/materials/${idCourse}/meetings/${pertemuan}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return normalizeMaterialOne(res.data);
  },

  async updateMaterial(
    idMaterial: string,
    payload: UpdateMaterialPayload
  ): Promise<void> {
    const form = new FormData();

    // File baru opsional — kalau tidak ada, BE tidak mengganti pathFile
    if (payload.file) {
      form.append("file", payload.file);
    }

    if (payload.namaFile !== undefined) {
      form.append("namaFile", payload.namaFile);
    }

    if (payload.visibility !== undefined) {
      form.append("visibility", payload.visibility);
    }

    // deskripsi harus JSON string karena BE pakai parseJsonField
    if (payload.deskripsi !== undefined && payload.deskripsi.trim() !== "") {
      form.append("deskripsi", JSON.stringify({ text: payload.deskripsi.trim() }));
    }

    await api.put(`/materials/${idMaterial}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deleteMaterial(idMaterial: string): Promise<void> {
    await api.delete(`/materials/${idMaterial}`);
  },
};