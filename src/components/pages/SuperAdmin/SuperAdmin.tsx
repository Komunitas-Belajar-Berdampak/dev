import Title from '@/components/shared/Title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Chart from 'react-apexcharts';

const breadcrumbItems = [{ label: 'Home' }];

/* =======================
   DUMMY DATA
======================= */
const stats = [
  { label: 'Total User', value: 1240 },
  { label: 'Mahasiswa', value: 980 },
  { label: 'Dosen', value: 210 },
  { label: 'Admin', value: 50 },
];

const barOptions: ApexCharts.ApexOptions = {
  chart: { toolbar: { show: false } },
  plotOptions: {
    bar: { borderRadius: 6, columnWidth: '45%' },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Mahasiswa', 'Dosen', 'Admin'],
  },
};

const barSeries = [
  {
    name: 'User',
    data: [980, 210, 50],
  },
];

const pieOptions: ApexCharts.ApexOptions = {
  labels: ['Aktif', 'Tidak Aktif'],
  legend: { position: 'bottom' },
};

const pieSeries = [1080, 160];

const SuperAdmin = () => {
  return (
    <div className='w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8'>
      {/* TITLE + BREADCRUMB */}
      <div className='space-y-2'>
        <Title title='Dashboard' items={breadcrumbItems} />
      </div>

      {/* ===== BENTO GRID ===== */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className='text-sm text-muted-foreground'>{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-3xl font-bold text-blue-800'>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ===== CHART ROW ===== */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* BAR CHART */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>User Berdasarkan Role</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart options={barOptions} series={barSeries} type='bar' height={320} />
          </CardContent>
        </Card>

        {/* PIE CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Status User</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart options={pieOptions} series={pieSeries} type='pie' height={320} />
          </CardContent>
        </Card>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Total Matakuliah</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-blue-800'>86</p>
            <p className='text-sm text-muted-foreground'>Semester aktif berjalan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Periode Akademik Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-lg font-semibold'>2025/2026 – Ganjil</p>
            <p className='text-sm text-muted-foreground'>Semester 7</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Fakultas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-bold text-blue-800'>7</p>
            <p className='text-sm text-muted-foreground'>Dengan 23 Program Studi</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdmin;
