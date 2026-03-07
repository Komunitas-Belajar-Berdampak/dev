import { api } from "@/lib/axios";

export type MeetingEntity = {
  id: string;
  pertemuan: number;
  judul: string;
  deskripsi?: string;
};

function normalizeMeetings(payload: any): MeetingEntity[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function normalizeMeetingOne(payload: any): any {
  return payload?.data ?? payload;
}

function mapToMeetingEntity(raw: any): MeetingEntity {
  const d = raw.deskripsi ?? raw.description;

  return {
    id: raw.id ?? raw._id ?? "",
    pertemuan: Number(raw.pertemuan ?? 0),
    judul: raw.judul ?? raw.title ?? "",
    deskripsi: d == null ? "" : typeof d === "object" ? JSON.stringify(d) : String(d),
  };
}

export const MeetingService = {
  async getMeetingsByCourseId(courseId: string): Promise<MeetingEntity[]> {
    const res = await api.get<any>(`/meetings/${courseId}`, {
      params: { limit: 16, page: 1 },
    });
    const list = normalizeMeetings(res.data);
    return list.map(mapToMeetingEntity);
  },

  async getMeetingDetail(
    pertemuan: number | string,
    idCourse: string
  ): Promise<MeetingEntity> {
    const res = await api.get<any>(`/meetings/${pertemuan}/courses/${idCourse}`);
    const raw = normalizeMeetingOne(res.data);
    return mapToMeetingEntity(raw);
  },

  async updateMeeting(
    idPertemuan: string,
    payload: { judul: string }
  ): Promise<MeetingEntity> {
    const res = await api.put<any>(`/meetings/${idPertemuan}`, payload);
    const raw = normalizeMeetingOne(res.data);
    return mapToMeetingEntity(raw);
  },
};