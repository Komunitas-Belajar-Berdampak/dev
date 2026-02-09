import NoData from '@/components/shared/NoData';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Circle from '@/components/ui/circle';
import { formatDateTime } from '@/lib/datetime';
import type { ThreadDetail } from '@/types/thread-post';
import { useEffect } from 'react';
import { toast } from 'sonner';
import DiscussionSkeleton from './DiscussionSkeleton';
import TiptapReadonlyContent from './TiptapReadonlyContent';

type DiscussionContentProps = {
  threadDetailQuery: {
    data: ThreadDetail[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const DiscussionContent = ({ threadDetailQuery }: DiscussionContentProps) => {
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

                <div className='w-full flex justify-end'>
                  <p className='text-sm text-accent'>{formatDateTime(thread.updatedAt, { dateLocale: 'en-GB', timeLocale: 'en-GB', hour12: false })}</p>
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
