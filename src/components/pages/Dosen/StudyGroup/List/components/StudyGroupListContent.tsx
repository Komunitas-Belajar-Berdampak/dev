import NoData from '@/components/shared/NoData';
import Pagination from '@/components/shared/Pagination';
import Search from '@/components/shared/Search';
import { Button } from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupbyCourse } from '@/types/sg';
import { Icon } from '@iconify/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import StudyGroupListSkeleton from '../../Main/components/StudyGroupListSkeleton';
import StudyGroupList from './StudyGroupList';
import { getStudyGroupsByCourse } from '@/api/sg';

type StudyGroupListProps = {
  idMatkul: string;
  namaMatkul: string;
};

const StudyGroupListContent = ({ idMatkul, namaMatkul }: StudyGroupListProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<StudyGroupbyCourse[]>, Error>({
    queryKey: ['sg-by-course', idMatkul, page],
    queryFn: () => getStudyGroupsByCourse(idMatkul, page),
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

        {/* Button */}
        <Link to={`/dosen/study-groups/${namaMatkul}/${encodeURIComponent(idMatkul)}/add`}>
          <Button className='shadow' size={'lg'}>
            <Icon icon='mdi:plus-box' />
            Add Study Group
          </Button>
        </Link>
      </div>

      {isLoading && <StudyGroupListSkeleton />}
      {!isLoading && isError && <ErrorMessage message='Tidak dapat memuat data.' />}
      {!isLoading && !isError && visibleStudyGroups.length === 0 && <NoData message='Tidak ada study group.' />}
      {!isLoading && !isError && visibleStudyGroups.length > 0 && <StudyGroupList studygroups={visibleStudyGroups} />}

      {!isLoading && !isError && totalPages > 1 && (
        <div className='mt-10 flex justify-center sm:justify-end'>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={isLoading} />
        </div>
      )}
    </>
  );
};

export default StudyGroupListContent;
