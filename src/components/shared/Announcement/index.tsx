import { TriangleAlertIcon } from 'lucide-react';

const Announcement = () => {
  return (
    <div className='w-full border border-gray-400 rounded-lg p-2 mt-12 flex gap-4'>
      <TriangleAlertIcon className='size-4 mt-1 ms-1' />
      <div className='flex flex-col justify-start gap-2 items-start'>
        <p className='font-semibold text-sm'>Tidak bisa Login?</p>
        <p className='text-xs'>Hubungi admin atau email ke admin@example.com untuk bantuan.</p>
      </div>
    </div>
  );
};

export default Announcement;
