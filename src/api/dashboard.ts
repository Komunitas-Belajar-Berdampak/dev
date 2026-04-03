import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { MhsDashboard } from "@/types/mhs-dashboard";

export const getMhsDashboard = async () => {
  const res = await api.get<ApiResponse<MhsDashboard>>(`/student-dashboard`);
  return res.data;
};
