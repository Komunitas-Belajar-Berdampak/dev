import { api } from "@/lib/axios";
import type { updateProfile as updateProfileType } from "@/schemas/profile";
import type { ApiResponse } from "@/types/api";
import type { UserProfile } from "@/types/profile";

export const getUserById = async (id: string) => {
  const res = await api.get<ApiResponse<UserProfile>>(`/users/${id}`);
  return res.data;
};

export const getUserByNrp = async (nrp: string) => {
  const res = await api.get<ApiResponse<UserProfile>>(`/users/nrp/${nrp}`);
  return res.data;
};

export const updateProfile = async (
  payload: Omit<updateProfileType, "gayaBelajar">,
) => {
  const res = await api.patch<
    ApiResponse<{
      status: string;
      message: string;
    }>
  >(`/users`, payload);
  return res.data;
};
