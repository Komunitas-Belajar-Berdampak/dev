import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Course, CourseById } from "@/types/course";

const getCourses = async ({
  page,
  limit,
  nrp,
  kelas,
  periode,
  status,
  sks,
}: {
  page?: number;
  limit?: number;
  nrp?: string;
  kelas?: string;
  periode?: string;
  status?: string;
  sks?: string;
}) => {
  const res = await api.get<ApiResponse<Course[]>>(`/courses`, {
    params: {
      page,
      limit,
      nrp,
      kelas,
      periode,
      status,
      sks,
    },
  });
  return res.data;
};

const getCourseById = async (id: string) => {
  const res = await api.get<ApiResponse<CourseById>>(`/courses/${id}`);
  return res.data;
};

export { getCourseById, getCourses };
