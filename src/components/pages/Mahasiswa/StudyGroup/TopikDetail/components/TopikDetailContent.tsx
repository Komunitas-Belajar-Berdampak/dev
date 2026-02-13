import { getStudyGroupById } from '@/api/study-group';
import { getTaskList } from '@/api/task';
import { getThreadsById } from '@/api/thread-post';
import TopikPembahasanDetailHeader from '@/components/pages/Dosen/StudyGroup/TopikDetail/components/Header';
import type { TabsType } from '@/components/pages/Dosen/StudyGroup/TopikDetail/types';
import type { FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import type { ApiResponse } from '@/types/api';
import type { AnggotaStudyGroup, StudyGroupDetail } from '@/types/sg';
import type { Task } from '@/types/task';
import type { ThreadDetail } from '@/types/thread-post';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { TASK_FILTER_ALL } from '../constant';
import TopikPembahasanDetailTabs from './Tabs';

type TopikDetailContentProps = {
  idTopik: string;
  namaTopik: string;
  idSg: string;
};

const TopikDetailContent = ({ idTopik, namaTopik, idSg }: TopikDetailContentProps) => {
  const [tab, setTab] = useState<TabsType>('todolist');
  const [filters, setFilters] = useState<TaskFilterValue>({
    memberId: TASK_FILTER_ALL,
    status: TASK_FILTER_ALL,
  });

  const [discussionDateFilter, setDiscussionDateFilter] = useState<FilterWithInputRangeValue<'all'>>({
    field: 'all',
    keyword: '',
    fromDate: '',
    toDate: '',
  });

  useEffect(() => {
    setFilters({ memberId: TASK_FILTER_ALL, status: TASK_FILTER_ALL });
    setDiscussionDateFilter({ field: 'all', keyword: '', fromDate: '', toDate: '' });
  }, [idTopik]);

  const handleTabChange = (newTab: TabsType) => {
    setTab(newTab);
  };

  const {
    data: toDoListData,
    isLoading: toDoListIsLoading,
    isError: toDoListIsError,
    error: toDoListError,
  } = useQuery<ApiResponse<Task[]>, Error, Task[]>({
    queryKey: ['tasks', idTopik],
    queryFn: () => getTaskList(idTopik),
    select: (res) => res.data,
  });

  const { data: membersData } = useQuery<ApiResponse<StudyGroupDetail>, Error, AnggotaStudyGroup[]>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    select: (res) => res.data.anggota ?? [],
  });

  const statusToDoList = {
    DONE: toDoListData?.filter((task) => task.status === 'DONE').length || 0,
    INPROGRESS: toDoListData?.filter((task) => task.status === 'IN PROGRESS').length || 0,
    DO: toDoListData?.filter((task) => task.status === 'DO').length || 0,
  };

  const {
    data: threadDetailData,
    isLoading: threadDetailIsLoading,
    isError: threadDetailIsError,
    error: threadDetailError,
  } = useQuery<ApiResponse<ThreadDetail[]>, Error, ThreadDetail[]>({
    queryKey: ['threads-by-id', idTopik],
    queryFn: () => getThreadsById(idTopik),
    select: (res) => res.data,
  });

  const filteredThreads = useMemo(() => {
    const raw = threadDetailData ?? [];

    const fromDateObj = discussionDateFilter.fromDate ? new Date(`${discussionDateFilter.fromDate}T00:00:00`) : null;
    const toDateObj = discussionDateFilter.toDate ? new Date(`${discussionDateFilter.toDate}T23:59:59.999`) : null;

    if (!fromDateObj && !toDateObj) return raw;

    return raw.filter((t) => {
      const ts = new Date(t.updatedAt);
      if (Number.isNaN(ts.getTime())) return false;
      if (fromDateObj && ts < fromDateObj) return false;
      if (toDateObj && ts > toDateObj) return false;
      return true;
    });
  }, [discussionDateFilter.fromDate, discussionDateFilter.toDate, threadDetailData]);

  const tasksQuery = {
    data: toDoListData ?? [],
    isLoading: toDoListIsLoading,
    isError: toDoListIsError,
    error: toDoListError,
  };

  const threadDetailQuery = {
    data: filteredThreads,
    isLoading: threadDetailIsLoading,
    isError: threadDetailIsError,
    error: threadDetailError,
  };

  return (
    <>
      <TopikPembahasanDetailHeader namaTopik={namaTopik} tab={tab} statusToDoList={statusToDoList} totalDiscussions={filteredThreads.length} />
      <TopikPembahasanDetailTabs
        tab={tab}
        changeTab={handleTabChange}
        filters={filters}
        onFiltersChange={setFilters}
        discussionDateFilter={discussionDateFilter}
        onDiscussionDateFilterChange={setDiscussionDateFilter}
        tasksQuery={tasksQuery}
        members={membersData ?? []}
        threadId={idTopik}
        threadDetailQuery={threadDetailQuery}
      />
    </>
  );
};

export default TopikDetailContent;
