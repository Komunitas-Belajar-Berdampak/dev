import { getCourses } from '@/api/course';
import Filter from '@/components/shared/Filter';
import NoData from '@/components/shared/NoData';
import Pagination from '@/components/shared/Pagination';
import Search from '@/components/shared/Search';
import ErrorMessage from '@/components/ui/error';
import { getVisibleCourses, type CourseSortOption } from '@/lib/course-utils';
import type { ApiResponse } from '@/types/api';
import type { Course } from '@/types/course';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import StudyGroupList from './StudyGroupList';
import StudyGroupListSkeleton from './StudyGroupListSkeleton';

const StudyGroupMainContent = () => {
  const [sort, setSort] = useState<CourseSortOption>('nama-asc');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<Course[]>, Error>({
    queryKey: ['courses', page],
    queryFn: () => getCourses(page),
  });

  const courses = useMemo(() => response?.data ?? [], [response]);
  const pagination = response?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data mata kuliah.', { toasterId: 'global' });
  }, [error?.message, isError]);

  const visibleCourses = useMemo(() => getVisibleCourses(courses, search, sort), [courses, search, sort]);

  return (
    <>
      {/* SEARCH & FILTER */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {/* SEARCH */}
        <Search value={search} onChange={setSearch} />

        {/* FILTER */}
        <Filter<CourseSortOption>
          value={sort}
          onValueChange={setSort}
          label='Sort by..'
          widthClassName='w-52'
          options={[
            { label: 'Nama (A-Z)', value: 'nama-asc' },
            { label: 'Nama (Z-A)', value: 'nama-desc' },
            { label: 'Periode (A-Z)', value: 'periode-asc' },
            { label: 'Periode (Z-A)', value: 'periode-desc' },
          ]}
        />
      </div>

      {/* STUDY GROUP LIST */}
      {isLoading && <StudyGroupListSkeleton count={3} />}
      {!isLoading && isError && <ErrorMessage message='Tidak dapat memuat data.' />}
      {!isLoading && !isError && visibleCourses.length === 0 && <NoData message='Tidak ada mata kuliah yang sesuai dengan pencarian.' />}
      {!isLoading && !isError && visibleCourses.length > 0 && <StudyGroupList courses={visibleCourses} />}

      {!isLoading && !isError && totalPages > 1 && (
        <div className='mt-10 flex justify-center sm:justify-end'>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={isLoading} />
        </div>
      )}
    </>
  );
};

export default StudyGroupMainContent;
