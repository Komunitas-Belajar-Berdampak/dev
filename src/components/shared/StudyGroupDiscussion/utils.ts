import { extractDiscussionText } from '@/lib/discussion-search';
import type { ThreadDetail, ThreadParentPostPreview } from '@/types/thread-post';
import type { JSONContent } from '@tiptap/react';

export const emptyPostContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
} satisfies JSONContent;

export const formatMessageTime = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));

export const formatMessageDay = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));

export const isSameDay = (first: string, second?: string) => {
  if (!second) return false;
  return new Date(first).toDateString() === new Date(second).toDateString();
};

export function isEditedPost(thread: ThreadDetail): boolean {
  const createdAtMs = new Date(thread.createdAt).getTime();
  const updatedAtMs = new Date(thread.updatedAt).getTime();

  if (Number.isNaN(createdAtMs) || Number.isNaN(updatedAtMs)) {
    return thread.createdAt !== thread.updatedAt;
  }

  return createdAtMs !== updatedAtMs;
}

export const toParentPostPreview = (thread: ThreadDetail): ThreadParentPostPreview => ({
  id: thread.id,
  author: thread.author,
  kontenPreview: extractDiscussionText(thread.konten) || 'Konten diskusi',
  createdAt: thread.createdAt,
});
