import { Skeleton } from '@/components/ui/skeleton';

const KontribusiMahasiswaDetailSkeleton = () => {
  return (
    <>
      <div className='space-y-2'>
        <Skeleton className='h-36 w-full' />
      </div>

      <div className='mt-6'>
        <div className='flex items-center justify-between gap-8'>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-12 w-40' />
        </div>

        <Skeleton className='h-1 w-full my-4' />

        <div className='flex justify-between items-center w-full'>
          <Skeleton className='h-4 w-1/2 my-4' />
          <Skeleton className='h-4 w-1/4 my-4' />
        </div>

        <div className='flex justify-between items-center w-full'>
          <Skeleton className='h-4 w-1/2 my-4' />
          <Skeleton className='h-4 w-1/4 my-4' />
        </div>

        <div className='flex justify-between items-center w-full'>
          <Skeleton className='h-4 w-1/2 my-4' />
          <Skeleton className='h-4 w-1/4 my-4' />
        </div>
      </div>
    </>
  );
};

export default KontribusiMahasiswaDetailSkeleton;
