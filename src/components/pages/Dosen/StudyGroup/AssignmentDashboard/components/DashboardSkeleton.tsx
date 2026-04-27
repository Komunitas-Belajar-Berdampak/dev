import { Skeleton } from '@/components/ui/skeleton';

const DashboardSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent bg-white p-4 shadow-sm'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-10 w-72' />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className='h-28 rounded-xl' />
        ))}
      </div>
      <Skeleton className='h-96 rounded-xl' />
      <Skeleton className='h-80 rounded-xl' />
    </div>
  );
};

export default DashboardSkeleton;
