import ContentHeader from '@/components/shared/ContentHeader';
import Circle from '@/components/ui/circle';
import type { StudyGroupMemberDetail } from '@/types/sg';
import { ListChecks } from 'lucide-react';

type KontribusiHeaderProps = {
  namaAnggota: string;
  data: StudyGroupMemberDetail['kontribusiTotalByThread'];
  totalKontribusi: number;
};

const KontribusiHeader = ({ namaAnggota, data, totalKontribusi }: KontribusiHeaderProps) => {
  return (
    <ContentHeader>
      <h1 className='text-primary font-bold text-lg '>{namaAnggota}</h1>

      {data.map((e) => (
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
  );
};
export default KontribusiHeader;
