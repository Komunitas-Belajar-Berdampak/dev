import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { Thread, ThreadDetail, ThreadLatestUpdate } from '@/types/thread-post';

const MOCK_THREAD_LATEST_UPDATE_DELAY_MS = 250;
const mockThreadLatestUpdates = new Map<string, ThreadLatestUpdate>();

const getStableMockThreadLatestUpdate = (threadId: string): ThreadLatestUpdate => {
  const existing = mockThreadLatestUpdates.get(threadId);
  if (existing) return existing;

  const latestUpdate: ThreadLatestUpdate = {
    latestUpdatedAt: null,
    totalPosts: 0,
  };

  mockThreadLatestUpdates.set(threadId, latestUpdate);
  return latestUpdate;
};

const getThreadsByStudyGroup = async (studyGroupId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<Thread[]>> => {
  const res = await api.get<ApiResponse<Thread[]>>(`/threads/sg/${studyGroupId}?page=${page}&limit=${limit}`);

  return res.data;
};

const createThreadByStudyGroup = async (studyGroupId: string, payload: { judul: string; idAssignment: string }): Promise<ApiResponse<null>> => {
  const res = await api.post<ApiResponse<null>>(`/threads/sg/${studyGroupId}`, payload);

  return res.data;
};

const getThreadsById = async (threadId: string): Promise<ApiResponse<ThreadDetail[]>> => {
  const res = await api.get<ApiResponse<ThreadDetail[]>>(`/threads/${threadId}?page=1&limit=100`);

  return res.data;
};

const getThreadLatestUpdate = async (threadId: string): Promise<ApiResponse<ThreadLatestUpdate>> => {
  await new Promise((resolve) => setTimeout(resolve, MOCK_THREAD_LATEST_UPDATE_DELAY_MS));

  return {
    status: 'success',
    message: 'status update berhasil dicek',
    data: getStableMockThreadLatestUpdate(threadId),
  };
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

export { addPost, createThreadByStudyGroup, deletePost, editPost, getPostById, getThreadLatestUpdate, getThreadsById, getThreadsByStudyGroup };
