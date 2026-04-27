import NoData from '@/components/shared/NoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

type ChartSeries = NonNullable<ApexOptions['series']>;

type ContributionChartsProps = {
  visibleRowsLength: number;
  isWeightEnabled: boolean;
  heatmapSeries: ChartSeries;
  heatmapOptions: ApexOptions;
  heatmapHeight: number;
  topContributorSeries: ChartSeries;
  topContributorOptions: ApexOptions;
};

const ContributionCharts = ({ visibleRowsLength, isWeightEnabled, heatmapSeries, heatmapOptions, heatmapHeight, topContributorSeries, topContributorOptions }: ContributionChartsProps) => {
  return (
    <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]'>
      <Card className='border-accent bg-white shadow-sm'>
        <CardHeader>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <CardTitle className='text-sm font-bold text-primary md:text-base'>Heatmap Kontribusi</CardTitle>
            {visibleRowsLength > 16 && <span className='text-xs text-accent'>Scroll untuk melihat semua mahasiswa</span>}
          </div>
        </CardHeader>
        <CardContent>
          <div className='max-h-[560px] overflow-y-auto pr-2'>
            <ReactApexChart type='heatmap' series={heatmapSeries} options={heatmapOptions} height={heatmapHeight} />
          </div>
        </CardContent>
      </Card>

      <Card className='border-accent bg-white shadow-sm'>
        <CardHeader>
          <CardTitle className='text-sm font-bold text-primary md:text-base'>{isWeightEnabled ? 'Top Contributor Berbobot' : 'Top Contributor'}</CardTitle>
        </CardHeader>
        <CardContent>{visibleRowsLength === 0 ? <NoData message='Belum ada kontributor.' /> : <ReactApexChart type='bar' series={topContributorSeries} options={topContributorOptions} height={320} />}</CardContent>
      </Card>
    </div>
  );
};

export default ContributionCharts;
