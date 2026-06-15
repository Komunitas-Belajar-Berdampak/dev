import NoData from '@/components/shared/NoData';
import { useScrollJump } from '@/hooks/use-scroll-jump';
import { getUser } from '@/lib/authStorage';
import { cn } from '@/lib/cn';
import type { ThreadDetail } from '@/types/thread-post';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DiscussionMessageBubble from './DiscussionMessageBubble';
import DiscussionScrollButtons from './DiscussionScrollButtons';
import DiscussionSkeleton from './DiscussionSkeleton';
import ReplyComposer from './ReplyComposer';
import { useDiscussionParentJump } from './hooks/useDiscussionParentJump';
import { useDiscussionReply } from './hooks/useDiscussionReply';

type DiscussionContentProps = {
  threadId: string;
  studyGroupId: string;
  discussionSearchKeyword?: string;
  clearDiscussionFilters: () => void;
  threadDetailQuery: {
    data: ThreadDetail[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const DiscussionContent = ({ threadId, studyGroupId, threadDetailQuery, discussionSearchKeyword = '', clearDiscussionFilters }: DiscussionContentProps) => {
  const user = getUser();
  const nrp = user?.nrp || '';
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);
  const keyword = discussionSearchKeyword.trim();
  const { canScrollUp, canScrollDown, scrollToTop, scrollToBottom } = useScrollJump({ watchValue: threadDetailQuery.data.length });
  const { highlightedId, jumpToParent } = useDiscussionParentJump({ clearDiscussionFilters, watchValue: threadDetailQuery.data });
  const { replyForm, replyToPost, startReply, cancelReply, submitReply, isReplySubmitting, isReplyImageUploading } = useDiscussionReply({
    threadId,
    studyGroupId,
    posts: threadDetailQuery.data,
  });

  useEffect(() => {
    if (!threadDetailQuery.isError) return;
    toast.error(threadDetailQuery.error?.message || 'Gagal mengambil data diskusi.', { toasterId: 'global' });
  }, [threadDetailQuery.error?.message, threadDetailQuery.isError]);

  if (threadDetailQuery.isLoading) return <DiscussionSkeleton />;

  return (
    <div className='relative py-6'>
      {threadDetailQuery.data.length === 0 ? (
        <NoData message='Belum ada diskusi yang dibuat' />
      ) : (
        <>
          <div className={cn('space-y-5', replyToPost ? 'pb-8' : 'pb-2')}>
            {threadDetailQuery.data.map((thread, index) => (
              <DiscussionMessageBubble
                key={thread.id}
                thread={thread}
                previousThread={threadDetailQuery.data[index - 1]}
                currentUserNrp={nrp}
                keyword={keyword}
                highlightedId={highlightedId}
                openDeleteId={openDeleteId}
                onOpenDeleteChange={(postId, open) => setOpenDeleteId(open ? postId : null)}
                onStartReply={startReply}
                onJumpToParent={jumpToParent}
              />
            ))}
          </div>

          {replyToPost && <ReplyComposer replyToPost={replyToPost} form={replyForm} onSubmit={submitReply} onCancel={cancelReply} isSubmitting={isReplySubmitting} isImageUploading={isReplyImageUploading} />}

          <DiscussionScrollButtons canScrollUp={canScrollUp} canScrollDown={canScrollDown} hasReplyComposer={Boolean(replyToPost)} onScrollToTop={scrollToTop} onScrollToBottom={scrollToBottom} />
        </>
      )}
    </div>
  );
};

export default DiscussionContent;
