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

function mapToMeetingEntity(raw: any): MeetingEntity {
  const d = raw.deskripsi ?? raw.description;

  return {
    id: raw.id ?? raw._id ?? "",
    pertemuan: Number(raw.pertemuan ?? 0),
    judul: raw.judul ?? raw.title ?? "",
    deskripsi: d == null ? "" : String(d),
  };
}


export const MeetingService = {
  async getMeetingsByCourseId(courseId: string): Promise<MeetingEntity[]> {
    const res = await api.get<any>(`/meetings/${courseId}`);
    const list = normalizeMeetings(res.data);
    return list.map(mapToMeetingEntity);
  },
};
