import Circle from '@/components/ui/circle';
import type { StudyGroupbyCourse } from '@/types/sg';
import { Edit } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

type StudyGroupListProps = {
  studygroups: StudyGroupbyCourse[];
};

const StudyGroupList = ({ studygroups }: StudyGroupListProps) => {
  return (
    <div className='flex flex-col w-full gap-4 py-10'>
      {studygroups.map((sg) => (
        <Fragment key={sg.id}>
          <Link className='flex gap-6 items-center w-full' to={`${sg.nama}/${encodeURIComponent(sg.id)}`}>
            <div>
              <Circle />
            </div>

            <div className='w-full flex flex-col  '>
              <div className='flex flex-row items-center justify-between'>
                <p className='text-primary font-bold text-sm'>{sg.nama}</p>
                <p className='text-primary font-bold text-sm'>{sg.totalKontribusi} points</p>
              </div>

              <div className='flex flex-row items-center justify-between'>
                <p className='text-accent text-sm'>
                  {sg.totalAnggota} / {sg.kapasitas} Anggota ({sg.totalRequest})
                </p>
                <Link to={`${sg.id}/edit`} className='text-sm text-blue-500 underline ml-2'>
                  <Edit size={15} className='text-primary' />
                </Link>
              </div>
            </div>
          </Link>

          <div className='border-t border-accent w-full' />
        </Fragment>
      ))}
    </div>
  );
};

export default StudyGroupList;
