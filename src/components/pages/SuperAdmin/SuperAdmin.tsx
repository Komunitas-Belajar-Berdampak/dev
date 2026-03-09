import Title from '@/components/shared/Title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Chart from 'react-apexcharts';
import { useDashboardStats } from './hooks/useDashboardStats';

const breadcrumbItems = [{ label: 'Home' }];

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

const SuperAdmin = () => {
  const { data, isLoading, error } = useDashboardStats();

  const stats = [
    { label: 'Total User', value: data?.totalUser ?? 0 },
    { label: 'Mahasiswa', value: data?.totalMahasiswa ?? 0 },
    { label: 'Dosen', value: data?.totalDosen ?? 0 },
    { label: 'Admin', value: data?.totalAdmin ?? 0 },
  ];

  const roleData = data?.totalUserPerRole ?? [];
  const barCategories = roleData.map((r) => r.role);
  const barValues = roleData.map((r) => r.total);

  const barOptions: ApexCharts.ApexOptions = {
    chart: { toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '45%' } },
    dataLabels: { enabled: false },
    xaxis: { categories: barCategories },
    colors: ['#1e3a8a'],
  };

  const barSeries = [{ name: 'User', data: barValues }];

  const pieOptions: ApexCharts.ApexOptions = {
    labels: ['Aktif', 'Tidak Aktif'],
    legend: { position: 'bottom' },
    colors: ['#1e3a8a', '#e2e8f0'],
  };

  const pieSeries = [
    data?.statusUser.aktif ?? 0,
    data?.statusUser.tidakAktif ?? 0,
  ];

  return (
    <div className='w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8'>
      <div className='space-y-2'>
        <Title title='Dashboard' items={breadcrumbItems} />
      </div>

      {error && (
        <p className='text-sm text-red-600'>{String(error)}</p>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : stats.map((item) => (
              <Card key={item.label}>
                <CardHeader>
                  <CardTitle className='text-sm text-muted-foreground'>{item.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-3xl font-bold text-blue-800'>{item.value.toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>User Berdasarkan Role</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-[320px] w-full' />
            ) : (
              <Chart options={barOptions} series={barSeries} type='bar' height={320} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status User</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-[320px] w-full' />
            ) : (
              <Chart options={pieOptions} series={pieSeries} type='pie' height={320} />
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Total Matakuliah</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <>
                <p className='text-2xl font-bold text-blue-800'>
                  {data?.totalMatakuliah ?? 0}
                </p>
                <p className='text-sm text-muted-foreground'>Semester aktif berjalan</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Periode Akademik Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-40' />
            ) : data?.periodeAktif ? (
              <>
                <p className='text-lg font-semibold'>
                  {data.periodeAktif.periode}
                  {data.periodeAktif.semesterType ? ` – ${data.periodeAktif.semesterType}` : ''}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {data.periodeAktif.startDate
                    ? new Date(data.periodeAktif.startDate).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })
                    : '-'}
                </p>
              </>
            ) : (
              <p className='text-sm text-muted-foreground'>Tidak ada periode aktif</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Fakultas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className='h-8 w-16' />
            ) : (
              <>
                <p className='text-2xl font-bold text-blue-800'>
                  {data?.totalFakultas ?? 0}
                </p>
                <p className='text-sm text-muted-foreground'>Terdaftar di sistem</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdmin;