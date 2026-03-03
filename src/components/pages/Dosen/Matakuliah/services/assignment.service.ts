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
  lampiran?: string;
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
    const body: Record<string, any> = {
      judul: payload.judul,
      statusTugas: payload.statusTugas ?? false,
      tenggat: payload.tenggat,
      lampiran: payload.lampiran ?? "",
      status: payload.status ?? "VISIBLE",
    };

    if (payload.deskripsi && payload.deskripsi.trim() !== "") {
      body.deskripsi = { text: payload.deskripsi };
    }

    const res = await api.post<any>(
      `/assignments/${idCourse}/meetings/${pertemuan}`,
      body
    );

    return normalizeAssignmentOne(res.data);
  },

  async updateAssignment(
    idAssignment: string,
    payload: UpdateAssignmentPayload
  ): Promise<void> {
    const body: Record<string, any> = {};

    if (payload.judul !== undefined) body.judul = payload.judul;
    if (payload.statusTugas !== undefined) body.statusTugas = payload.statusTugas;
    if (payload.tenggat !== undefined) body.tenggat = payload.tenggat;
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.lampiran !== undefined) body.lampiran = payload.lampiran;
    if (payload.deskripsi !== undefined && payload.deskripsi.trim() !== "") {
      body.deskripsi = { text: payload.deskripsi };
    }

    await api.put(`/assignments/${idAssignment}`, body);
  },

  async deleteAssignment(idAssignment: string): Promise<void> {
    await api.delete(`/assignments/${idAssignment}`);
  },
};