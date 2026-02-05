import NoData from '@/components/shared/NoData';
import Circle from '@/components/ui/circle';
import type { StudyGroupDetail } from '@/types/sg';
import { UserRoundX } from 'lucide-react';

type DashboardKontribusiContentProps = {
  totalKontribusi?: number;
  anggota?: StudyGroupDetail['anggota'];
};

const DashboardKontribusiContent = ({ totalKontribusi = 0, anggota = [] }: DashboardKontribusiContentProps) => {
  return (
    <>
      {!anggota.length ? (
        <NoData variant='border'>
          <UserRoundX size={48} className='mx-auto mb-4 text-accent' />
          <p className='text-center text-accent'>Tidak ada anggota yang bergabung.</p>
        </NoData>
      ) : (
        <div className='w-full flex flex-col pt-6'>
          {anggota.map((member) => (
            <div className='w-full flex flex-row gap-6 items-center' key={member.id}>
              <div>
                <Circle />
              </div>

              <div className='flex flex-col w-full'>
                <span className='text-primary font-bold text-sm'>{member.nama}</span>
                <span className='text-accent text-sm'>{member.nrp}</span>
              </div>

              <div className='flex flex-row gap-4 items-center w-1/3'>
                <div className='w-full h-[0.4rem] bg-accent overflow-hidden rounded-xl'>
                  <div className={`bg-primary h-full rounded-full`} style={{ width: `${(member.totalKontribusi / totalKontribusi) * 100}%` }} />
                </div>
                <span className='text-primary font-bold text-sm'>{member.totalKontribusi}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default DashboardKontribusiContent;
