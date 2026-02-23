import { api } from "@/lib/axios";
import type { Assignment, BEStatus } from "../types";

function normalizeAssignmentOne(payload: any): Assignment {
  return (payload?.data ?? payload) as Assignment;
}

export type CreateAssignmentPayload = {
  judul: string;
  tenggat: string; // ISO string
  status?: BEStatus;
  statusTugas?: boolean;
  file?: File;
  deskripsi?: any;
};

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
    form.append("tenggat", payload.tenggat);

    if (payload.status) form.append("status", payload.status);
    if (payload.statusTugas !== undefined)
      form.append("statusTugas", String(payload.statusTugas));

    if (payload.file) form.append("file", payload.file);

    if (payload.deskripsi !== undefined) {
      form.append(
        "deskripsi",
        typeof payload.deskripsi === "string"
          ? payload.deskripsi
          : JSON.stringify(payload.deskripsi)
      );
    }

    const res = await api.post<any>(
      `/assignments/${idCourse}/meetings/${pertemuan}`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return normalizeAssignmentOne(res.data);
  },
};