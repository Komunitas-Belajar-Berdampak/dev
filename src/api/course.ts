import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Course } from '@/types/course';

const getCourses = async (page: number = 1, limit: number = 10) => {
  const res = await api.get<ApiResponse<Course[]>>(`/courses?page=${page}&limit=${limit}`);
  return res.data;
};

export { getCourses };
