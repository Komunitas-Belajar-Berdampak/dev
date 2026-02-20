import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Thread, ThreadDetail } from '@/types/thread-post';

const getThreadsByStudyGroup = async (studyGroupId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Thread[]>> => {
  const res = await api.get<ApiResponse<Thread[]>>(`/threads/sg/${studyGroupId}?page=${page}&limit=${limit}`);

  return res.data;
};

const createThreadByStudyGroup = async (studyGroupId: string, payload: { judul: string; assignmentId: string }): Promise<ApiResponse<null>> => {
  const res = await api.post<ApiResponse<null>>(`/threads/sg/${studyGroupId}`, payload);

  return res.data;
};

const getThreadsById = async (threadId: string): Promise<ApiResponse<ThreadDetail[]>> => {
  const res = await api.get<ApiResponse<ThreadDetail[]>>(`/threads/${threadId}`);

  return res.data;
};

const addPost = async (threadId: string, payload: { konten: unknown }): Promise<ApiResponse<null>> => {
  const res = await api.post<ApiResponse<null>>(`/threads/${threadId}`, payload);
  return res.data;
};

const editPost = async (postId: string, payload: { konten: unknown }): Promise<ApiResponse<null>> => {
  const res = await api.put<ApiResponse<null>>(`/posts/${postId}`, payload);

  return res.data;
};

const getPostById = async (postId: string): Promise<ApiResponse<ThreadDetail>> => {
  const res = await api.get<ApiResponse<ThreadDetail>>(`/posts/${postId}`);

  return res.data;
};

const deletePost = async (postId: string): Promise<ApiResponse<null>> => {
  const res = await api.delete<ApiResponse<null>>(`/posts/${postId}`);

  return res.data;
};

export { addPost, createThreadByStudyGroup, deletePost, editPost, getPostById, getThreadsById, getThreadsByStudyGroup };
