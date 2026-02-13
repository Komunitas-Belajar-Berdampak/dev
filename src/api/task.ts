import { api } from '@/lib/axios';
import type { TaskSchemaType, TaskUpdateSchemaType } from '@/schemas/task';
import type { ApiResponse } from '@/types/api';
import type { Task } from '@/types/task';

const getTaskList = async (threadId: string) => {
  const res = await api.get<ApiResponse<Task[]>>(`/tasks/thread/${threadId}`);
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
