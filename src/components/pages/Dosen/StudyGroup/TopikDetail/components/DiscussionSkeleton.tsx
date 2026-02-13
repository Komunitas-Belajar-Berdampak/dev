import { Skeleton } from '@/components/ui/skeleton';

const DiscussionSkeleton = () => {
  return (
    <div className='py-6 w-full rounded-xl border border-accent shadow-sm overflow-hidden p-4 '>
      <div className='space-y-6 py-8 px-4'>
        <div className='flex flex-row gap-6 w-full items-center'>
          <div>
            <Skeleton className='h-14 w-14 rounded-full' />
          </div>

          <div className='flex flex-col justify-center gap-2 w-1/2'>
            <Skeleton className='h-5 w-35' />
            <Skeleton className='h-5 w-30' />
          </div>

          <div className='w-full flex justify-end'>
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
