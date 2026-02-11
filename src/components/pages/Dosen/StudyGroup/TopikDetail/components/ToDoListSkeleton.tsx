import { Skeleton } from '@/components/ui/skeleton';

const ToDoListSkeleton = () => {
  return (
    <div className='mt-6 w-full rounded-xl border border-accent shadow-sm overflow-hidden p-4'>
      <div className='space-y-3'>
        <Skeleton className='h-6 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    </div>
  );
};

export default ToDoListSkeleton;
