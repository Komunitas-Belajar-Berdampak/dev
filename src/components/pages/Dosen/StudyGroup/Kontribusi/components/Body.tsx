import FilterWithInputRange, { type FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import NoData from '@/components/shared/NoData';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/lib/datetime';
import type { StudyGroupMemberDetail } from '@/types/sg';
import { ChevronRight, ListX } from 'lucide-react';
import { useState } from 'react';

type KontribusiBodyProps = {
  data: StudyGroupMemberDetail;
};

const KontribusiBody = ({ data }: KontribusiBodyProps) => {
  const [filter, setFilter] = useState<FilterWithInputRangeValue<string>>({
    field: 'all',
    keyword: '',
    fromDate: '',
    toDate: '',
  });

  const fromDateObj = filter.fromDate ? new Date(`${filter.fromDate}T00:00:00`) : null;
  const toDateObj = filter.toDate ? new Date(`${filter.toDate}T23:59:59.999`) : null;

  const threadOptions = [{ label: 'Semua', value: 'all' }, ...(data?.kontribusiTotalByThread ?? []).map((t) => ({ label: t.thread, value: t.thread }))];

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
export default KontribusiBody;
