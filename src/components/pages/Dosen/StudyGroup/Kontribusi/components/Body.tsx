import { KONTRIBUSI_ALL_THREAD_VALUE } from '@/components/pages/Dosen/StudyGroup/TopikDetail/constant';
import FilterWithInputRange, { type FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import NoData from '@/components/shared/NoData';
import { Separator } from '@/components/ui/separator';
import { buildDailyTrend, buildTrendSeries, formatDateOnly, formatTimeOnly, getFilteredAktivitas, getMostActiveDay, getThreadOptions, getTrendOptions, groupAktivitasByDate } from '@/lib/kontribusi';
import type { StudyGroupMemberDetail } from '@/types/sg';
import { ListX } from 'lucide-react';
import { useMemo, useState } from 'react';
import ActivityLogList from './ActivityLogList';
import OverviewPanel from './OverviewPanel';

type KontribusiBodyProps = {
  data: StudyGroupMemberDetail;
};

const KontribusiBody = ({ data }: KontribusiBodyProps) => {
  const [filter, setFilter] = useState<FilterWithInputRangeValue<string>>({
    field: KONTRIBUSI_ALL_THREAD_VALUE,
    keyword: '',
    fromDate: '',
    toDate: '',
  });

  const threadOptions = useMemo(() => getThreadOptions(data), [data]);

  const aktivitasFiltered = useMemo(
    () =>
      getFilteredAktivitas({
        aktivitas: data?.aktivitas ?? [],
        field: filter.field,
        keyword: filter.keyword,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
      }),
    [data?.aktivitas, filter.field, filter.keyword, filter.fromDate, filter.toDate],
  );

  const aktivitasGroupedByDate = useMemo(() => groupAktivitasByDate(aktivitasFiltered), [aktivitasFiltered]);

  const dailyTrend = useMemo(() => buildDailyTrend(aktivitasFiltered), [aktivitasFiltered]);

  const totalAktivitas = aktivitasFiltered.length;
  const totalPoin = aktivitasFiltered.reduce((sum, item) => sum + item.kontribusi, 0);

  const mostActiveDay = useMemo(() => getMostActiveDay(dailyTrend), [dailyTrend]);
  const trendSeries = useMemo(() => buildTrendSeries(dailyTrend), [dailyTrend]);
  const trendOptions = useMemo(() => getTrendOptions(), []);

  return (
    <>
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
          <>
            <OverviewPanel totalAktivitas={totalAktivitas} totalPoin={totalPoin} mostActiveDay={mostActiveDay} trendOptions={trendOptions} trendSeries={trendSeries} />

            <ActivityLogList grouped={aktivitasGroupedByDate} formatDateOnly={formatDateOnly} formatTimeOnly={formatTimeOnly} />
          </>
        )}
      </div>
    </>
  );
};
export default KontribusiBody;
