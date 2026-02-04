import { Skeleton } from '@/components/ui/skeleton';

type StudyGroupListSkeletonProps = {
  count?: number;
};

const StudyGroupListSkeleton = ({ count = 3 }: StudyGroupListSkeletonProps) => {
  return (
    <div className='flex flex-col w-full gap-4 py-10'>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className='w-full'>
          <div className='flex gap-6 items-center'>
            <Skeleton className='w-12 h-12 rounded-full' />
            <div className='flex flex-col gap-2 w-full max-w-md'>
              <Skeleton className='h-4 w-60' />
              <Skeleton className='h-3 w-40' />
            </div>
          </div>
          <div className='border-t border-accent w-full mt-4' />
        </div>
      ))}
    </div>
  );
};

export default StudyGroupListSkeleton;
