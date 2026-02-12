import { getThreadsByStudyGroup } from '@/api/thread-post';
import NoData from '@/components/shared/NoData';
import Circle from '@/components/ui/circle';
import ErrorMessage from '@/components/ui/error';
import type { ApiResponse } from '@/types/api';
import type { Thread } from '@/types/thread-post';
import { useQuery } from '@tanstack/react-query';
import { ListChecks } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import StudyGroupListSkeleton from '../../Main/components/StudyGroupListSkeleton';

type TopikPembahasanContentProps = {
  idSg: string;
};

const TopikPembahasanContent = ({ idSg }: TopikPembahasanContentProps) => {
  const { data, isLoading, isError, error, isFetching } = useQuery<ApiResponse<Thread[]>, Error, Thread[]>({
    queryKey: ['threads-by-sg', idSg],
    queryFn: () => getThreadsByStudyGroup(idSg),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil topik pembahasan.', { toasterId: 'global' });
  }, [error?.message, isError]);

  if (isLoading || isFetching) return <StudyGroupListSkeleton />;

  return (
    <>
      {!isLoading && isError && <ErrorMessage message='Tidak dapat memuat data.' />}

      {!isLoading && !isError && data?.length === 0 ? (
        <NoData variant={'border'}>
          <ListChecks size={48} className='mx-auto mb-4 text-accent' />
          <p className='text-center text-accent'>Belum ada topik pembahasan.</p>
        </NoData>
      ) : (
        <div className='w-full pt-8 flex flex-col gap-6'>
          {data?.map((thread) => (
            <Link to={`${thread.judul}/${thread.id}`} className='flex flex-row w-full  gap-6' key={thread.id}>
              <Circle className='flex justify-center items-center'>
                <ListChecks className='text-primary ' />
              </Circle>

              <div className='flex flex-col justify-center'>
                <span className='text-primary font-bold text-sm'>{thread.judul}</span>
                <span className='text-accent text-sm'>{thread.assignment}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
export default TopikPembahasanContent;
