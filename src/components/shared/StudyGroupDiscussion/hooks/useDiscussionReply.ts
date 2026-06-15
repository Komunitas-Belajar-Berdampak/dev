import { addPost } from '@/api/thread-post';
import { emptyPostContent } from '@/components/shared/StudyGroupDiscussion/utils';
import { hasPendingImageUpload, postSchema, type PostSchemaType } from '@/schemas/post';
import type { ThreadDetail } from '@/types/thread-post';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { JSONContent } from '@tiptap/react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type UseDiscussionReplyOptions = {
  threadId: string;
  studyGroupId: string;
  posts: ThreadDetail[];
};

export function useDiscussionReply({ threadId, studyGroupId, posts }: UseDiscussionReplyOptions) {
  const queryClient = useQueryClient();
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const replyToPost = useMemo(() => posts.find((thread) => thread.id === replyToId) ?? null, [replyToId, posts]);

  const replyForm = useForm<PostSchemaType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      konten: emptyPostContent,
    },
  });
  const replyContent = replyForm.watch('konten') as JSONContent;
  const isReplyImageUploading = hasPendingImageUpload(replyContent);

  const { mutate: submitReply, isPending: isReplySubmitting } = useMutation({
    mutationFn: (values: PostSchemaType) => {
      if (!replyToPost) throw new Error('Post yang dibalas tidak ditemukan.');
      return addPost(threadId, { konten: values.konten, parentPostId: replyToPost.id });
    },
    onSuccess: async () => {
      toast.success('Reply berhasil ditambahkan!', { toasterId: 'global' });
      replyForm.reset({ konten: emptyPostContent });
      setReplyToId(null);

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['threads-by-id', threadId] }),
        queryClient.invalidateQueries({ queryKey: ['thread-latest-update', threadId] }),
        queryClient.invalidateQueries({ queryKey: ['sg-detail', studyGroupId] }),
        queryClient.invalidateQueries({ queryKey: ['study-group-member-by-id', studyGroupId] }),
      ]);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menambahkan reply.', { toasterId: 'global' });
    },
  });

  const startReply = (thread: ThreadDetail) => {
    setReplyToId(thread.id);
    replyForm.reset({ konten: emptyPostContent });
  };

  const cancelReply = () => {
    setReplyToId(null);
    replyForm.reset({ konten: emptyPostContent });
  };

  return {
    replyForm,
    replyToPost,
    startReply,
    cancelReply,
    submitReply,
    isReplySubmitting,
    isReplyImageUploading,
  };
}
