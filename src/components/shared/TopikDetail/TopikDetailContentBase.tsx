import { getTaskList } from '@/api/task';
import { getThreadsById } from '@/api/thread-post';
import TopikPembahasanDetailHeader from '@/components/pages/Dosen/StudyGroup/TopikDetail/components/Header';
import type { TabsType } from '@/components/pages/Dosen/StudyGroup/TopikDetail/types';
import type { FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import { extractDiscussionText } from '@/lib/discussion-search';
import type { ApiResponse } from '@/types/api';
import type { Task } from '@/types/task';
import type { ThreadDetail } from '@/types/thread-post';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';

const TASK_FILTER_ALL = 'all' as const;

type TopikDetailContentBaseProps = {
  idTopik: string;
  namaTopik: string;
  renderTabs: (params: {
    tab: TabsType;
    onTabChange: (tab: TabsType) => void;
    filters: TaskFilterValue;
    onFiltersChange: (value: TaskFilterValue) => void;
    discussionSearchKeyword: string;
    onDiscussionSearchKeywordChange: (value: string) => void;
    discussionDateFilter: FilterWithInputRangeValue<'all'>;
    onDiscussionDateFilterChange: (value: FilterWithInputRangeValue<'all'>) => void;
    tasksQuery: {
      data: Task[];
      isLoading: boolean;
      isError: boolean;
      error: Error | null;
    };
    threadDetailQuery: {
      data: ThreadDetail[];
      isLoading: boolean;
      isError: boolean;
      error: Error | null;
    };
  }) => ReactNode;
};

const getTabFromQuery = (tab: string | null): TabsType => {
  if (tab === 'discussion') return 'discussion';
  return 'todolist';
};

const TopikDetailContentBase = ({ idTopik, namaTopik, renderTabs }: TopikDetailContentBaseProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [tab, setTab] = useState<TabsType>(() => getTabFromQuery(tabParam));
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
  const [discussionSearchKeyword, setDiscussionSearchKeyword] = useState('');

  const handleTabChange = (newTab: TabsType) => {
    setTab(newTab);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('tab', newTab);
        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    setFilters({ memberId: TASK_FILTER_ALL, status: TASK_FILTER_ALL });
    setDiscussionDateFilter({ field: 'all', keyword: '', fromDate: '', toDate: '' });
    setDiscussionSearchKeyword('');
  }, [idTopik]);

  useEffect(() => {
    const nextTab = getTabFromQuery(tabParam);
    setTab((prevTab) => (prevTab === nextTab ? prevTab : nextTab));
  }, [tabParam]);

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

  const statusToDoList = {
    DONE: toDoListData?.filter((task) => task.status === 'DONE').length || 0,
    INPROGRESS: toDoListData?.filter((task) => task.status === 'IN PROGRESS').length || 0,
    DO: toDoListData?.filter((task) => task.status === 'DO').length || 0,
  };

  const tasksQuery = {
    data: toDoListData ?? [],
    isLoading: toDoListIsLoading,
    isError: toDoListIsError,
    error: toDoListError,
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
    const keyword = discussionSearchKeyword.trim().toLowerCase();

    const searchFiltered = keyword
      ? raw.filter((thread) => {
          const authorName = thread.author.nama.toLowerCase();
          const authorNrp = thread.author.nrp.toLowerCase();
          const contentText = extractDiscussionText(thread.konten).toLowerCase();

          return authorName.includes(keyword) || authorNrp.includes(keyword) || contentText.includes(keyword);
        })
      : raw;

    const fromDateObj = discussionDateFilter.fromDate ? new Date(`${discussionDateFilter.fromDate}T00:00:00`) : null;
    const toDateObj = discussionDateFilter.toDate ? new Date(`${discussionDateFilter.toDate}T23:59:59.999`) : null;

    if (!fromDateObj && !toDateObj) return searchFiltered;

    return searchFiltered.filter((t) => {
      const ts = new Date(t.updatedAt);
      if (Number.isNaN(ts.getTime())) return false;
      if (fromDateObj && ts < fromDateObj) return false;
      if (toDateObj && ts > toDateObj) return false;
      return true;
    });
  }, [discussionDateFilter.fromDate, discussionDateFilter.toDate, discussionSearchKeyword, threadDetailData]);

  const threadDetailQuery = {
    data: filteredThreads,
    isLoading: threadDetailIsLoading,
    isError: threadDetailIsError,
    error: threadDetailError,
  };

  return (
    <>
      <TopikPembahasanDetailHeader namaTopik={namaTopik} tab={tab} statusToDoList={statusToDoList} totalDiscussions={filteredThreads.length} />
      {renderTabs({
        tab,
        onTabChange: handleTabChange,
        filters,
        onFiltersChange: setFilters,
        discussionSearchKeyword,
        onDiscussionSearchKeywordChange: setDiscussionSearchKeyword,
        discussionDateFilter,
        onDiscussionDateFilterChange: setDiscussionDateFilter,
        tasksQuery,
        threadDetailQuery,
      })}
    </>
  );
};

export default TopikDetailContentBase;
