import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

export const getMajors = async () => {
  const res = await api.get<ApiResponse<null>>(`/majors`);
  return res.data;
};

// export const getMajorById = async (id: string) => {
//   const res = await api.get<ApiResponse<any[]>>(`/majors/${id}`);
//   return res.data;
// };
