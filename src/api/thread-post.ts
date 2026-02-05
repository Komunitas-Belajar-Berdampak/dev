import type { ApiResponse } from '@/types/api';
import type { Thread } from '@/types/thread-post';

const getThreadsByStudyGroup = async (studyGroupId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Thread[]>> => {
  //   const res = await api.get<ApiResponse<Thread[]>>(`/threads/${studyGroupId}?page=${page}&limit=${limit}`);

  const res = await new Promise<{ data: ApiResponse<Thread[]> }>((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          status: 'success',
          message: 'Success',
          data: [
            {
              id: 'thread-1',
              judul: 'Diskusi Materi Algoritma',
              assignment: 'Tugas 1: Implementasi Algoritma Sorting',
            },
          ],
        },
      });
    }, 1000);
  });

  return res.data;
};
export { getThreadsByStudyGroup };
