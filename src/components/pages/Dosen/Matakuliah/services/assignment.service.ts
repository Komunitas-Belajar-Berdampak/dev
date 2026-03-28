import { api } from "@/lib/axios";
import type { Assignment } from "../types";

function normalizeAssignmentOne(payload: any): Assignment {
  return (payload?.data ?? payload) as Assignment;
}

export type BEStatus = "HIDE" | "VISIBLE";

export type CreateAssignmentPayload = {
  judul: string;
  tenggat: string;
  statusTugas?: boolean;
  status?: BEStatus;
  file?: File;                       // file lampiran opsional
  deskripsi?: string;
};

export type UpdateAssignmentPayload = Partial<CreateAssignmentPayload>;

export const AssignmentService = {
  async getAssignmentsByCourse(idCourse: string): Promise<Assignment[]> {
    const res = await api.get<any>(`/assignments/${idCourse}`);
    const payload = res.data;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    if (Array.isArray(payload?.items)) return payload.items;
    return [];
  },

  async createAssignmentByCourseMeeting(
    idCourse: string,
    pertemuan: number,
    payload: CreateAssignmentPayload
  ): Promise<Assignment> {
    const form = new FormData();

    form.append("judul", payload.judul);
    form.append("statusTugas", String(payload.statusTugas ?? false));
    form.append("tenggat", payload.tenggat);
    form.append("status", payload.status ?? "VISIBLE");

    // BE mengambil file lampiran via req.file dengan field name "lampiran"
    if (payload.file) {
      form.append("lampiran", payload.file);
    }

    // deskripsi harus JSON string karena BE pakai parseJsonField
    if (payload.deskripsi?.trim()) {
      form.append("deskripsi", JSON.stringify({ text: payload.deskripsi.trim() }));
    }

    const res = await api.post<any>(
      `/assignments/${idCourse}/meetings/${pertemuan}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return normalizeAssignmentOne(res.data);
  },

  async updateAssignment(
    idAssignment: string,
    payload: UpdateAssignmentPayload
  ): Promise<void> {
    const form = new FormData();

    if (payload.judul !== undefined) form.append("judul", payload.judul);
    if (payload.statusTugas !== undefined) form.append("statusTugas", String(payload.statusTugas));
    if (payload.tenggat !== undefined) form.append("tenggat", payload.tenggat);
    if (payload.status !== undefined) form.append("status", payload.status);

    // File lampiran baru opsional
    if (payload.file) {
      form.append("lampiran", payload.file);
    }

    // deskripsi harus JSON string karena BE pakai parseJsonField
    if (payload.deskripsi !== undefined && payload.deskripsi.trim() !== "") {
      form.append("deskripsi", JSON.stringify({ text: payload.deskripsi.trim() }));
    }

    await api.put(`/assignments/${idAssignment}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deleteAssignment(idAssignment: string): Promise<void> {
    await api.delete(`/assignments/${idAssignment}`);
  },
};