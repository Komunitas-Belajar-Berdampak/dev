import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MhsGrade } from "@/types/grade";

export async function getMhsGrade() {
  const res = await api.get<ApiResponse<MhsGrade>>(`/student-dashboard/grades`);
  return res.data;
}
