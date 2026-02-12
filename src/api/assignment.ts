import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Assignment } from '@/types/assignment';

const getAssignmentsByCourse = async (courseId: string): Promise<ApiResponse<Assignment[]>> => {
  const res = await api.get<ApiResponse<Assignment[]>>(`/assignments/${courseId}`);
  return res.data;
};

export { getAssignmentsByCourse };
