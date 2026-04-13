import { TriangleAlertIcon } from 'lucide-react';
import { ANNOUNCEMENT_EMAIL, ANNOUNCEMENT_LOGIN_BODY, ANNOUNCEMENT_LOGIN_SUBJECT } from './constants';

const Announcement = () => {
  return (
    <div className='w-full border border-gray-400 rounded-lg p-2 mt-12 flex gap-4'>
      <TriangleAlertIcon className='size-4 mt-1 ms-1' />
      <div className='flex flex-col justify-start gap-2 items-start'>
        <p className='font-semibold text-sm'>Tidak bisa Login?</p>
        <p className='text-xs'>
          Silakan hubungi admin atau kirim email dengan mengklik{' '}
          <a href={`mailto:${ANNOUNCEMENT_EMAIL}?subject=${encodeURIComponent(ANNOUNCEMENT_LOGIN_SUBJECT)}&body=${encodeURIComponent(ANNOUNCEMENT_LOGIN_BODY)}`} className='text-blue-600 underline underline-offset-2 hover:text-primary'>
            di sini
          </a>{' '}
          untuk mendapatkan bantuan.
        </p>
      </div>
    </div>
  );
};

export default Announcement;
