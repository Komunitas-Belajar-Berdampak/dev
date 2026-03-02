import { api } from "@/lib/axios";
import type { DosenCourseDetail } from "../hooks/useMatakuliahDetail";

export const DeskripsiService = {
  async updateDeskripsi(id: string, deskripsi: string): Promise<DosenCourseDetail> {
    const res = await api.patch<any>(`/courses/${id}`, {
      deskripsi: { content: deskripsi },
    });
    return (res.data?.data ?? res.data) as DosenCourseDetail;
  },
};