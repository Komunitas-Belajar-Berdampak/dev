import Circle from '@/components/ui/circle';
import type { Course } from '@/types/course';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

type StudyGroupListProps = {
  courses: Course[];
};

const StudyGroupList = ({ courses }: StudyGroupListProps) => {
  return (
    <div className='flex flex-col w-full gap-4 py-10'>
      {courses.map((course) => (
        <Fragment key={course.id}>
          <Link className='flex gap-6 items-center' to={`/dosen/study-groups/${course.namaMatkul}/${encodeURIComponent(course.id)}`}>
            <Circle />
            <div className='flex flex-col'>
              <p className='text-primary font-bold text-sm'>
                {course.kodeMatkul} - {course.namaMatkul}
              </p>
              <p className='text-accent text-sm'>{course.periode}</p>
            </div>
          </Link>

          <div className='border-t border-accent w-full' />
        </Fragment>
      ))}
    </div>
  );
};

export default StudyGroupList;
