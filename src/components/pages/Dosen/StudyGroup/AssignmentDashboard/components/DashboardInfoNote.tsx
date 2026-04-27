import { ChartNoAxesColumn } from 'lucide-react';

const DashboardInfoNote = () => {
  return (
    <div className='rounded-xl border border-accent bg-secondary p-4 shadow-sm'>
      <div className='flex items-start gap-3'>
        <ChartNoAxesColumn className='mt-0.5 size-5 text-primary' />
        <p className='text-xs leading-6 text-primary md:text-sm'>
          Dashboard ini menggunakan poin kontribusi sebagai indikator monitoring. Simulasi bobot hanya indikator tambahan untuk melihat pengaruh kontribusi antar assignment, bukan komponen nilai utama.
        </p>
      </div>
    </div>
  );
};

export default DashboardInfoNote;
