import { Skeleton } from '@/components/ui/skeleton';

const EditStudyGroupSkeleton = () => {
  return (
    <div className='flex flex-col gap-4'>
      {/* Row 1: Nama + Kapasitas */}
      <div className='flex flex-row justify-between gap-4'>
        <div className='flex flex-col gap-2 w-full'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='flex flex-col gap-2 ml-4 w-full'>
          <Skeleton className='h-4 w-44' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      {/* Row 2: Deskripsi + Anggota */}
      <div className='flex flex-row gap-4 mt-4'>
        <div className='flex flex-col gap-2 w-full'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-10 w-full' />
        </div>
        <div className='flex flex-col gap-2 ml-4 w-full'>
          <Skeleton className='h-4 w-40' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>

      {/* Row 3: Checkbox */}
      <div className='flex flex-row items-center gap-2 mt-4'>
        <Skeleton className='h-5 w-5 rounded' />
        <Skeleton className='h-4 w-80' />
      </div>

      {/* Row 4: Buttons */}
      <div className='flex w-full justify-end gap-4 mt-6'>
        <Skeleton className='h-10 w-24 rounded-md' />
        <Skeleton className='h-10 w-24 rounded-md' />
      </div>
    </div>
  );
};

export default EditStudyGroupSkeleton;
