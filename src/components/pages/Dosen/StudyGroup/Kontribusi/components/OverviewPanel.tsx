import type { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

type OverviewPanelProps = {
  totalAktivitas: number;
  totalPoin: number;
  mostActiveDay: string;
  trendOptions: ApexOptions;
  trendSeries: { name: string; data: { x: number; y: number }[] }[];
};

const OverviewPanel = ({ totalAktivitas, totalPoin, mostActiveDay, trendOptions, trendSeries }: OverviewPanelProps) => {
  return (
    <div className='rounded-xl border border-accent bg-white p-4 my-4 shadow-sm'>
      <div className='mb-4 grid grid-cols-1 gap-3 md:grid-cols-3'>
        <div className='rounded-lg border border-accent bg-secondary px-3 py-2 shadow-sm'>
          <p className='text-xs text-accent'>Total aktivitas</p>
          <p className='text-sm font-semibold text-primary'>{totalAktivitas}</p>
        </div>
        <div className='rounded-lg border border-accent bg-secondary px-3 py-2 shadow-sm'>
          <p className='text-xs text-accent'>Total points</p>
          <p className='text-sm font-semibold text-primary'>{totalPoin}</p>
        </div>
        <div className='rounded-lg border border-accent bg-secondary px-3 py-2 shadow-sm'>
          <p className='text-xs text-accent'>Hari paling aktif</p>
          <p className='text-sm font-semibold text-primary'>{mostActiveDay}</p>
        </div>
      </div>
      <h3 className='mb-3 text-sm font-semibold text-primary'>Tren kontribusi per hari</h3>
      <ReactApexChart options={trendOptions} series={trendSeries} type='bar' height={260} />
    </div>
  );
};

export default OverviewPanel;
