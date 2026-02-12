import { api } from '@/lib/axios';
import type { TaskSchemaType, TaskUpdateSchemaType } from '@/schemas/task';
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

const addTask = async (threadId: string, payload: TaskSchemaType): Promise<ApiResponse<Task>> => {
  const res = await api.post<ApiResponse<Task>>(`/tasks/thread/${threadId}`, payload);
  return res.data;
};

const updateTask = async (taskId: string, payload: TaskUpdateSchemaType): Promise<ApiResponse<Task>> => {
  const res = await api.put<ApiResponse<Task>>(`/tasks/${taskId}`, payload);
  return res.data;
};

const deleteTask = async (taskId: string): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(`/tasks/${taskId}`);
  return res.data;
};

export { addTask, deleteTask, getTaskList, updateTask };
