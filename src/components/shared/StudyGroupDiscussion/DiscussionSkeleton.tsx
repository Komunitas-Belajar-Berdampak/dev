import { Skeleton } from '@/components/ui/skeleton';

const DiscussionSkeleton = () => {
  return (
    <div className='w-full overflow-hidden rounded-xl border border-accent p-4 py-6 shadow-sm'>
      <div className='space-y-6 px-4 py-8'>
        <div className='flex w-full flex-row items-center gap-6'>
          <div>
            <Skeleton className='h-14 w-14 rounded-full' />
          </div>

          <div className='flex w-1/2 flex-col justify-center gap-2'>
            <Skeleton className='h-5 w-35' />
            <Skeleton className='h-5 w-30' />
          </div>

          <div className='flex w-full justify-end'>
            <Skeleton className='h-5 w-30' />
          </div>
        </div>

        <Skeleton className='h-20 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    </div>
  );
};

export default DiscussionSkeleton;
