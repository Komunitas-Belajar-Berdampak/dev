import { getStudyGroupsByMembership } from '@/api/study-group';
import StudyGroupListSkeleton from '@/components/pages/Dosen/StudyGroup/Main/components/StudyGroupListSkeleton';
import NoData from '@/components/shared/NoData';
import Pagination from '@/components/shared/Pagination';
import Search from '@/components/shared/Search';
import ErrorMessage from '@/components/ui/error';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupByMembership } from '@/types/sg';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import ListItem from './ListItem';

type StudyGroupListProps = {
  idMatkul: string;
  namaMatkul: string;
};

const StudyGroupListContent = ({ idMatkul }: StudyGroupListProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<StudyGroupByMembership[]>, Error>({
    queryKey: ['sg-by-course-memberships', idMatkul, page],
    queryFn: () => getStudyGroupsByMembership(idMatkul, page),
    placeholderData: keepPreviousData,
  });

  const studyGroups = useMemo(() => response?.data ?? [], [response?.data]);

  const visibleStudyGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return studyGroups;
    return studyGroups.filter((sg) => sg.nama.toLowerCase().includes(q));
  }, [studyGroups, search]);

  const pagination = response?.pagination;
  const totalPages = pagination?.total_pages ?? 1;

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data mata kuliah.', { toasterId: 'global' });
  }, [error?.message, isError]);

  return (
    <>
      {/* Search and Button */}
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {/* SEARCH */}
        <Search value={search} onChange={setSearch} />
      </div>

      {isLoading && <StudyGroupListSkeleton />}
      {!isLoading && isError && <ErrorMessage message='Tidak dapat memuat data.' />}
      {!isLoading && !isError && visibleStudyGroups.length === 0 && <NoData message='Tidak ada study group.' />}
      {!isLoading && !isError && visibleStudyGroups.length > 0 && <ListItem studygroups={visibleStudyGroups} courseId={idMatkul} page={page} />}

      {!isLoading && !isError && totalPages > 1 && (
        <div className='mt-10 flex justify-center sm:justify-end'>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={isLoading} />
        </div>
      )}
    </>
  );
};

export default StudyGroupListContent;
