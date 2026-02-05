import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Thread } from '@/types/thread-post';

const getThreadsByStudyGroup = async (studyGroupId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Thread[]>> => {
  const res = await api.get<ApiResponse<Thread[]>>(`/threads/${studyGroupId}?page=${page}&limit=${limit}`);

  return res.data;
};
export { getThreadsByStudyGroup };
