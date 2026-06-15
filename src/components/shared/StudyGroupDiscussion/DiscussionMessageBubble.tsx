import TiptapReadonlyContent from '@/components/shared/TiptapReadonlyContent';
import UserInitialAvatar from '@/components/shared/UserInitialAvatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/cn';
import { extractDiscussionText, getContentSnippet, renderHighlightedText } from '@/lib/discussion-search';
import type { ThreadDetail } from '@/types/thread-post';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Edit, MessageSquareReply, Trash } from 'lucide-react';
import { Link } from 'react-router-dom';
import DialogDeletePost from './DialogDeletePost';
import ParentPostPreview from './ParentPostPreview';
import { formatMessageDay, formatMessageTime, isEditedPost, isSameDay } from './utils';

type DiscussionMessageBubbleProps = {
  thread: ThreadDetail;
  previousThread?: ThreadDetail;
  currentUserNrp: string;
  keyword: string;
  highlightedId: string | null;
  openDeleteId: string | null;
  onOpenDeleteChange: (postId: string, open: boolean) => void;
  onStartReply: (thread: ThreadDetail) => void;
  onJumpToParent: (parentId: string) => void;
};

const DiscussionMessageBubble = ({ thread, previousThread, currentUserNrp, keyword, highlightedId, openDeleteId, onOpenDeleteChange, onStartReply, onJumpToParent }: DiscussionMessageBubbleProps) => {
  const isOwnMessage = thread.author.nrp === currentUserNrp;
  const contentSnippet = getContentSnippet(extractDiscussionText(thread.konten), keyword);
  const showDayDivider = !isSameDay(thread.createdAt, previousThread?.createdAt);
  const parentId = thread.parentPost?.author ? thread.parentPost.id : null;

  return (
    <div className='space-y-4'>
      {showDayDivider && (
        <div className='flex justify-center'>
          <span className='rounded-full border border-accent bg-white px-3 py-1 text-[11px] font-medium text-primary/60 shadow-sm md:text-xs'>{formatMessageDay(thread.createdAt)}</span>
        </div>
      )}

      <div className={cn('flex w-full gap-3', isOwnMessage ? 'justify-end' : 'justify-start')}>
        {!isOwnMessage && (
          <div className='mt-1 shrink-0'>
            <UserInitialAvatar name={thread.author.nama} />
          </div>
        )}

        <div className={cn('group flex w-full max-w-[92%] flex-col gap-1 md:max-w-[70%]', isOwnMessage ? 'items-end' : 'items-start')}>
          <div
            id={`discussion-post-${thread.id}`}
            className={cn(
              'w-fit max-w-full scroll-mt-24 rounded-2xl border px-4 py-3 shadow-sm transition-all duration-500',
              isOwnMessage ? 'rounded-br-md border-primary/20 bg-primary/10 text-primary' : 'rounded-bl-md border-accent bg-white text-primary',
              highlightedId === thread.id && 'bg-primary/20 ring-2 ring-primary ring-offset-2',
            )}
          >
            <div className='mb-2 flex flex-wrap items-center gap-x-2 gap-y-1'>
              <span className='text-xs font-bold text-primary md:text-sm'>{isOwnMessage ? 'Anda' : renderHighlightedText(thread.author.nama, keyword)}</span>
              <span className='text-[11px] text-accent md:text-xs'>{renderHighlightedText(thread.author.nrp, keyword)}</span>
            </div>

            <ParentPostPreview parentPost={thread.parentPost} keyword={keyword} className={cn('mb-3', isOwnMessage ? 'bg-white/80' : 'bg-secondary/70')} onJump={parentId ? () => onJumpToParent(parentId) : undefined} />

            {keyword && contentSnippet && <p className='mb-2 text-[11px] text-accent md:text-xs'>Match in content: {renderHighlightedText(contentSnippet, keyword)}</p>}

            <TiptapReadonlyContent content={thread.konten} className='w-full border-none text-xs leading-relaxed text-primary md:text-sm [&_.tiptap-thread]:space-y-2 [&_.tiptap-thread_p]:my-0' />

            <div className={cn('mt-2 flex items-center gap-1 text-[11px] text-primary/50 md:text-xs', isOwnMessage ? 'justify-end' : 'justify-start')}>
              <span>{isEditedPost(thread) ? 'edited - ' : ''}</span>
              <span>{formatMessageTime(thread.updatedAt)}</span>
            </div>
          </div>

          <div className={cn('flex flex-wrap items-center gap-1 px-1 opacity-100 md:opacity-80 md:transition-opacity md:group-hover:opacity-100', isOwnMessage ? 'justify-end' : 'justify-start')}>
            <Button type='button' variant='ghost' size='sm' className='h-7 gap-1 px-2 text-xs text-primary shadow-none' onClick={() => onStartReply(thread)} aria-label={`Reply discussion dari ${thread.author.nama}`}>
              <MessageSquareReply className='size-3.5' />
              Reply
            </Button>

            {isOwnMessage && (
              <>
                <Button variant='ghost' size='sm' className='h-7 px-2 text-primary shadow-none' asChild>
                  <Link to={`edit-discussion/${thread.id}`} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                    <Edit className='size-3.5' />
                    <span className='sr-only'>Edit discussion</span>
                  </Link>
                </Button>

                <Dialog open={openDeleteId === thread.id} onOpenChange={(open) => onOpenDeleteChange(thread.id, open)}>
                  <DialogTrigger asChild>
                    <Button variant='ghost' size='sm' className='h-7 px-2 text-primary shadow-none' aria-label='Delete discussion'>
                      <Trash className='size-3.5' />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className='rounded-xl text-xs md:text-sm'>
                    <DialogDeletePost postId={thread.id} onClose={() => onOpenDeleteChange(thread.id, false)} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>

        {isOwnMessage && (
          <div className='mt-1 shrink-0'>
            <UserInitialAvatar name={thread.author.nama} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionMessageBubble;
