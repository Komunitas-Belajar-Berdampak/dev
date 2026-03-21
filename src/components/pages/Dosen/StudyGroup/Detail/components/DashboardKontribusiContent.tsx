import NoData from '@/components/shared/NoData';
import UserInitialAvatar from '@/components/shared/UserInitialAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { getUser } from '@/lib/authStorage';
import { shortString } from '@/lib/short-string';
import type { StudyGroupDetail } from '@/types/sg';
import { UserRoundX } from 'lucide-react';
import { Link } from 'react-router-dom';

type DashboardKontribusiContentProps = {
  totalKontribusi?: number;
  anggota?: StudyGroupDetail['anggota'];
};

const DashboardKontribusiContent = ({ totalKontribusi = 0, anggota = [] }: DashboardKontribusiContentProps) => {
  const user = getUser();
  const nrp = user?.nrp;
  const isMobile = useIsMobile();

  return (
    <>
      {!anggota.length ? (
        <NoData variant='border'>
          <UserRoundX size={48} className='mx-auto mb-4 text-accent' />
          <p className='text-center text-accent'>Tidak ada anggota yang bergabung.</p>
        </NoData>
      ) : (
        <div className='w-full flex flex-col pt-6 gap-6'>
          {anggota.map((member) => (
            <Link to={`kontribusi/${member.nama}/${member.id}`} className='w-full flex flex-row gap-6 items-center' key={member.id}>
              <div>
                <UserInitialAvatar name={member.nama} />
              </div>

              <div className='flex flex-col w-full'>
                {isMobile ? (
                  <span className='text-primary font-bold text-xs md:text-sm'>
                    {shortString(member.nama, 15)} {member.nrp === nrp && '(Anda)'}
                  </span>
                ) : (
                  <span className='text-primary font-bold text-xs md:text-sm'>
                    {shortString(member.nama, 50)} {member.nrp === nrp && '(Anda)'}
                  </span>
                )}

                <span className='text-accent text-xs md:text-sm'>{member.nrp}</span>
              </div>

              <div className='flex flex-row gap-4 items-center w-full md:w-1/3'>
                <div className='w-full h-[0.4rem] bg-accent overflow-hidden rounded-xl'>
                  <div className={`bg-primary h-full rounded-full`} style={{ width: ` ${totalKontribusi !== 0 ? (member.totalKontribusi / totalKontribusi) * 100 : 0}%` }} />
                </div>
                <span className='text-primary font-bold text-xs md:text-sm'>{member.totalKontribusi}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
export default DashboardKontribusiContent;
