import NoData from '@/components/shared/NoData';
import UserInitialAvatar from '@/components/shared/UserInitialAvatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { useScrollJump } from '@/hooks/use-scroll-jump';
import { getUser } from '@/lib/authStorage';
import { formatDateTime } from '@/lib/datetime';
import { extractDiscussionText, getContentSnippet, renderHighlightedText } from '@/lib/discussion-search';
import type { ThreadDetail } from '@/types/thread-post';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { ArrowDown, ArrowUp, Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import TiptapReadonlyContent from '../../../../../shared/TiptapReadonlyContent';
import { isEditedPost } from '../utils/isEditedPost';
import DialogDeletePost from './DialogDeletePost';
import DiscussionSkeleton from './DiscussionSkeleton';

type DiscussionContentProps = {
  discussionSearchKeyword?: string;
  threadDetailQuery: {
    data: ThreadDetail[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const DiscussionContent = ({ threadDetailQuery, discussionSearchKeyword = '' }: DiscussionContentProps) => {
  const user = getUser();
  const nrp = user?.nrp;
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const keyword = discussionSearchKeyword.trim();
  const { canScrollUp, canScrollDown, scrollToTop, scrollToBottom } = useScrollJump({ watchValue: threadDetailQuery.data.length });

  useEffect(() => {
    if (!threadDetailQuery.isError) return;
    toast.error(threadDetailQuery.error?.message || 'Gagal mengambil data diskusi.', { toasterId: 'global' });
  }, [threadDetailQuery.error?.message, threadDetailQuery.isError]);

  if (threadDetailQuery.isLoading) return <DiscussionSkeleton />;

  return (
    <div className='py-6 space-y-6'>
      {threadDetailQuery.data.length === 0 ? (
        <NoData message='Belum ada diskusi yang dibuat' />
      ) : (
        <>
          {threadDetailQuery.data.map((thread: ThreadDetail) => {
            const contentSnippet = getContentSnippet(extractDiscussionText(thread.konten), keyword);

            return (
              <Card key={thread.id} className='py-12 px-4 border-accent'>
                <CardHeader className='flex flex-row gap-6 items-center justify-start w-full px-0'>
                  {isMobile ? <div></div> : <div></div>}
                  <div>
                    <UserInitialAvatar name={thread.author.nama} />
                  </div>

                  <div className='flex flex-col justify-center w-1/2'>
                    <p className='text-xs md:text-sm text-primary font-bold'>{renderHighlightedText(thread.author.nama, keyword)}</p>
                    <p className='text-xs md:text-sm text-accent '>{renderHighlightedText(thread.author.nrp, keyword)}</p>
                  </div>

                  <div className='w-full flex justify-end items-center gap-2 md:gap-4'>
                    <p className='text-xs md:text-sm text-accent'>
                      {isEditedPost(thread) ? 'edited - ' : ''}
                      {formatDateTime(thread.updatedAt, { dateLocale: 'en-GB', timeLocale: 'en-GB', hour12: false })}
                    </p>

                    {thread.author.nrp === nrp && (
                      <>
                        <Button variant='ghost' size='sm' asChild>
                          <Link to={`edit-discussion/${thread.id}`} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                            <Edit className='text-primary' />
                          </Link>
                        </Button>

                        <Dialog open={openDeleteId === thread.id} onOpenChange={(open) => setOpenDeleteId(open ? thread.id : null)}>
                          <DialogTrigger asChild>
                            <Button variant='ghost' size='sm'>
                              <Trash className='text-primary' />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className='rounded-xl text-xs md:text-sm'>
                            <DialogDeletePost postId={thread.id} onClose={() => setOpenDeleteId(null)} />
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </CardHeader>

                <CardContent className='py-4 flex flex-col gap-6'>
                  {keyword && contentSnippet && <p className='text-[11px] md:text-xs text-accent'>Match in content: {renderHighlightedText(contentSnippet, keyword)}</p>}

                  <TiptapReadonlyContent content={thread.konten} className='w-full text-primary border-none text-xs md:text-sm' />
                </CardContent>
              </Card>
            );
          })}

          {(canScrollUp || canScrollDown) && (
            <div className='fixed right-4 bottom-6 md:right-8 md:bottom-8 z-40 flex flex-col gap-2'>
              {canScrollUp && (
                <Button type='button' variant='default' size='icon' onClick={scrollToTop} className='rounded-full shadow-sm' aria-label='Scroll ke atas'>
                  <ArrowUp className='size-4' />
                </Button>
              )}

              {canScrollDown && (
                <Button type='button' variant='default' size='icon' onClick={scrollToBottom} className='rounded-full shadow-sm' aria-label='Scroll ke bawah'>
                  <ArrowDown className='size-4' />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DiscussionContent;
