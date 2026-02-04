import { Skeleton } from '@/components/ui/skeleton';

const StudyGroupDetailContentSkeleton = () => {
  return (
    <>
      <div className='space-y-2'>
        <Skeleton className='h-28 w-full' />
      </div>

      <div className='mt-6'>
        <div className='flex gap-8'>
          <Skeleton className='h-9 w-28' />
          <Skeleton className='h-9 w-44' />
          <Skeleton className='h-9 w-40' />
        </div>

        <div className='mt-6 space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-24 w-full' />
          </div>
          <Skeleton className='h-10 w-full' />
          <div className='space-y-3'>
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
            <Skeleton className='h-12 w-full' />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyGroupDetailContentSkeleton;
