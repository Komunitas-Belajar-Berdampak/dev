import { Skeleton } from '@/components/ui/skeleton';

const KontribusiMahasiswaDetailSkeleton = () => {
  return (
    <>
      <div className='space-y-3'>
        <Skeleton className='h-36 w-full' />
      </div>

      <div className='mt-6 space-y-4'>
        <div className='flex items-center justify-between gap-6'>
          <Skeleton className='h-6 w-56' />
          <Skeleton className='h-11 w-44' />
        </div>

        <div className='flex flex-wrap gap-2'>
          <Skeleton className='h-8 w-20 rounded-full' />
          <Skeleton className='h-8 w-28 rounded-full' />
          <Skeleton className='h-8 w-24 rounded-full' />
          <Skeleton className='h-8 w-32 rounded-full' />
        </div>

        <Skeleton className='h-1 w-full' />

        <div className='rounded-xl border border-accent p-4 space-y-4'>
          <div className='grid grid-cols-1 gap-3 md:grid-cols-3'>
            <Skeleton className='h-16 w-full rounded-lg' />
            <Skeleton className='h-16 w-full rounded-lg' />
            <Skeleton className='h-16 w-full rounded-lg' />
          </div>
          <Skeleton className='h-5 w-44' />
          <Skeleton className='h-64 w-full rounded-lg' />
        </div>

        <Skeleton className='h-5 w-36' />

        <div className='space-y-4'>
          <Skeleton className='h-7 w-28 rounded-full' />
          <div className='rounded-lg border border-accent p-3 space-y-3'>
            <Skeleton className='h-14 w-full rounded-md' />
            <Skeleton className='h-14 w-full rounded-md' />
            <Skeleton className='h-14 w-full rounded-md' />
          </div>
        </div>

        <div className='space-y-4'>
          <Skeleton className='h-7 w-28 rounded-full' />
          <div className='rounded-lg border border-accent p-3 space-y-3'>
            <Skeleton className='h-14 w-full rounded-md' />
            <Skeleton className='h-14 w-full rounded-md' />
          </div>
        </div>
      </div>
    </>
  );
};

export default KontribusiMahasiswaDetailSkeleton;
