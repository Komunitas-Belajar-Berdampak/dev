import type { ApiResponse } from '@/types/api';
import type { Task } from '@/types/task';

const getTaskList = async (threadId: string) => {
  // const res = await api.get<ApiResponse<Task[]>>(`/tasks/thread/${threadId}`);

  const res = await new Promise<{ data: ApiResponse<Task[]> }>((resolve) => {
    setTimeout(
      () =>
        resolve({
          data: {
            status: 'success',
            message: 'Fetched tasks successfully (mock).',
            data: [
              {
                id: 'task-1',
                task: 'Read Chapter 1',
                mahasiswa: [
                  {
                    id: 'mahasiswa-1',
                    nama: 'Alice',
                  },
                  {
                    id: 'mahasiswa-2',
                    nama: 'Bob',
                  },
                ],
                status: 'DONE',
              },
              {
                id: 'task-2',
                task: 'Complete Assignment 1',
                mahasiswa: [
                  {
                    id: 'mahasiswa-3',
                    nama: 'Charlie',
                  },
                ],
                status: 'IN PROGRESS',
              },
            ],
          },
        }),
      1000,
    );
  });

  return res.data;
};

export { getTaskList };
