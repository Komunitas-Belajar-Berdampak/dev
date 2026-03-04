import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export const getLearningApproach = async (id: string) => {
  const res = await api.get<ApiResponse<null>>(`/approach/${id}`);
  return res.data;
};
