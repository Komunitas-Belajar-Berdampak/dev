import { api } from "@/lib/axios";
import type { updateApproachType } from "@/schemas/approach";
import type { ApiResponse } from "@/types/api";

export const getLearningApproach = async (id: string) => {
  const res = await api.get<ApiResponse<null>>(`/approach/${id}`);
  return res.data;
};

export const createLearningApproach = async (
  id: string,
  payload: updateApproachType,
) => {
  const res = await api.post<ApiResponse<null>>(`/approach/${id}`, payload);
  return res.data;
};

export const updateLearningApproach = async (
  id: string,
  payload: updateApproachType,
) => {
  const res = await api.patch<ApiResponse<null>>(`/approach/${id}`, payload);
  return res.data;
};
