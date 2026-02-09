import NoData from '@/components/shared/NoData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Circle from '@/components/ui/circle';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getUser } from '@/lib/authStorage';
import { formatDateTime } from '@/lib/datetime';
import type { ThreadDetail } from '@/types/thread-post';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import DialogDeletePost from './DialogDeletePost';
import DiscussionSkeleton from './DiscussionSkeleton';
import TiptapReadonlyContent from '../../../../../shared/TiptapReadonlyContent';

type DiscussionContentProps = {
  threadDetailQuery: {
    data: ThreadDetail[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const DiscussionContent = ({ threadDetailQuery }: DiscussionContentProps) => {
  const user = getUser();
  const nrp = user?.nrp;
  const [openDeleteId, setOpenDeleteId] = useState<string | null>(null);

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
          {threadDetailQuery.data.map((thread: ThreadDetail) => (
            <Card key={thread.id} className='py-8 px-4 border-accent'>
              <CardHeader className='flex flex-row gap-6 items-center w-full'>
                <div>
                  <Circle />
                </div>

                <div className='flex flex-col justify-center w-1/2'>
                  <p className='text-sm text-primary font-bold'>{thread.author.nama}</p>
                  <p className='text-sm text-accent '>{thread.author.nrp}</p>
                </div>

                <div className='w-full flex justify-end items-center gap-4'>
                  <p className='text-sm text-accent'>{formatDateTime(thread.updatedAt, { dateLocale: 'en-GB', timeLocale: 'en-GB', hour12: false })}</p>

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
                        <DialogContent className='border-accent'>
                          <DialogDeletePost postId={thread.id} onClose={() => setOpenDeleteId(null)} />
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className='py-4 flex flex-col gap-6'>
                <TiptapReadonlyContent content={thread.konten} className='w-full text-primary border-none' />
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default DiscussionContent;
