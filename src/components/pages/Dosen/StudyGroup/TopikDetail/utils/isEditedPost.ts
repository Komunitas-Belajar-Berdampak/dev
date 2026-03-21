import type { ThreadDetail } from '@/types/thread-post';

export function isEditedPost(thread: ThreadDetail): boolean {
  const createdAtMs = new Date(thread.createdAt).getTime();
  const updatedAtMs = new Date(thread.updatedAt).getTime();

  if (Number.isNaN(createdAtMs) || Number.isNaN(updatedAtMs)) {
    return thread.createdAt !== thread.updatedAt;
  }

  return createdAtMs !== updatedAtMs;
}
