import { getStudyGroupMemberById } from '@/api/study-group';
import ContentHeader from '@/components/shared/ContentHeader';
import FilterWithInputRange, { type FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import NoData from '@/components/shared/NoData';
import Circle from '@/components/ui/circle';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/lib/datetime';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupMemberDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, ListChecks, ListX } from 'lucide-react';
import { useEffect, useState } from 'react';
import KontribusiMahasiswaDetailSkeleton from './KontribusiSkeleton';

type KontribusiMahasiswaDetailContentProps = {
  idStudyGroup: string;
  idAnggota: string;
  namaAnggota: string;
};

const KontribusiMahasiswaDetailContent = ({ idStudyGroup, idAnggota, namaAnggota }: KontribusiMahasiswaDetailContentProps) => {
  const { data, isLoading, isError, error, isFetching } = useQuery<ApiResponse<StudyGroupMemberDetail>, Error, StudyGroupMemberDetail>({
    queryKey: ['study-group-member-by-id', idStudyGroup, idAnggota],
    queryFn: () => getStudyGroupMemberById(idStudyGroup, idAnggota),
    select: (res) => res.data,
  });

  const [filter, setFilter] = useState<FilterWithInputRangeValue<string>>({
    field: 'all',
    keyword: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    if (!isError) return;
    console.error(error?.message || 'Gagal mengambil data kontribusi mahasiswa.');
  }, [error?.message, isError]);

  const fromDateObj = filter.fromDate ? new Date(`${filter.fromDate}T00:00:00`) : null;
  const toDateObj = filter.toDate ? new Date(`${filter.toDate}T23:59:59.999`) : null;

  const threadOptions = [{ label: 'Semua', value: 'all' }, ...(data?.kontribusiTotalByThread ?? []).map((t) => ({ label: t.thread, value: t.thread }))];
  const totalKontribusi = data?.totalKontribusi ?? 0;

  const aktivitasFiltered = (data?.aktivitas ?? []).filter((a) => {
    if (filter.field !== 'all' && a.thread !== filter.field) return false;
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      const hay = `${a.thread} ${a.aktivitas}`.toLowerCase();
      if (!hay.includes(kw)) return false;
    }

    const ts = new Date(a.timestamp);
    if (fromDateObj && ts < fromDateObj) return false;
    if (toDateObj && ts > toDateObj) return false;
    return true;
  });

  if (isLoading || isFetching) return <KontribusiMahasiswaDetailSkeleton />;
  if (isError) return <NoData message={error?.message || 'Gagal mengambil data kontribusi mahasiswa.'} />;
  if (!data) return <NoData message='Data kontribusi tidak ditemukan.' />;

  return (
    <>
      {/* header */}
      <ContentHeader>
        <h1 className='text-primary font-bold text-lg '>{namaAnggota}</h1>

        {data.kontribusiTotalByThread.map((e) => (
          <div className='flex flex-row gap-6 items-center mt-4 w-full px-4 ' key={e.thread}>
            <Circle size={35} className='flex justify-center items-center'>
              <ListChecks className='text-primary w-8 h-8 p-2' />
            </Circle>

            <span className='text-primary font-bold text-sm w-full'>{e.thread}</span>

            <div className='h-[0.4rem] bg-accent overflow-hidden rounded-xl w-1/3'>
              <div className='bg-primary h-full rounded-full' style={{ width: `${(e.kontribusi / totalKontribusi) * 100}%` }} />
            </div>
            <span className='text-primary font-bold text-sm'>{e.kontribusi}</span>
          </div>
        ))}
      </ContentHeader>

      {/* title dan filter */}
      <div className='flex flex-col gap-4 '>
        <div className='flex flex-row justify-between items-center'>
          <h2 className='text-primary font-bold '>Aktivitas yang dilakukan</h2>

          {/* Filter by */}
          <FilterWithInputRange value={filter} onValueChange={setFilter} fields={threadOptions} label='Filter by..' />
        </div>
        <Separator className='bg-accent ' />
      </div>

      {/* isi log aktivitasnya  */}
      <div className='flex flex-col gap-4'>
        {aktivitasFiltered.length === 0 ? (
          <NoData variant='border'>
            <ListX size={48} className='mx-auto mb-4 text-accent' />
            <p className='text-center text-accent'>Tidak ada aktivitas yang sesuai dengan filter.</p>
          </NoData>
        ) : (
          aktivitasFiltered.map((a, idx) => (
            <div key={`${a.thread}-${a.timestamp}-${idx}`} className='flex flex-row justify-between items-center'>
              <div className='flex flex-row justify-center items-center gap-2'>
                <ChevronRight size={12} className='text-primary' />
                <span className='text-primary font-medium text-sm'>{a.aktivitas}</span>
              </div>
              <span className='text-accent text-xs'>{formatDateTime(a.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default KontribusiMahasiswaDetailContent;
