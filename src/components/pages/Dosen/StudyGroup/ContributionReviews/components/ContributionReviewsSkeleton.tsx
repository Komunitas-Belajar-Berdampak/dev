import { Skeleton } from '@/components/ui/skeleton';

const ContributionReviewsSkeleton = () => (
  <div className='space-y-4'>
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {[1, 2, 3].map((item) => (
        <Skeleton key={item} className='h-24 rounded-xl' />
      ))}
    </div>
    <Skeleton className='h-14 rounded-xl' />
    {[1, 2, 3].map((item) => (
      <Skeleton key={item} className='h-48 rounded-xl' />
    ))}
  </div>
);

export default ContributionReviewsSkeleton;
