import { getTaskList } from '@/api/task';
import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import type { ApiResponse } from '@/types/api';
import type { Task } from '@/types/task';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { TASK_FILTER_ALL } from '../constant';
import type { TabsType } from '../types';
import TopikPembahasanDetailHeader from './Header';
import TopikPembahasanDetailTabs from './Tabs';

type TopikPembahasanDetailContentProps = {
  idTopik: string;
};

const TopikPembahasanDetailContent = ({ idTopik }: TopikPembahasanDetailContentProps) => {
  const [tab, setTab] = useState<TabsType>('todolist');
  const [filters, setFilters] = useState<TaskFilterValue>({
    memberId: TASK_FILTER_ALL,
    status: TASK_FILTER_ALL,
  });

  useEffect(() => {
    setFilters({ memberId: TASK_FILTER_ALL, status: TASK_FILTER_ALL });
  }, [idTopik]);

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

  return (
    <>
      {/* kotak title */}
      <TopikPembahasanDetailHeader tab={tab} statusToDoList={statusToDoList} />

      {/* Tabs */}
      <TopikPembahasanDetailTabs tab={tab} onTabChange={setTab} filters={filters} onFiltersChange={setFilters} tasksQuery={tasksQuery} />
    </>
  );
};
export default TopikPembahasanDetailContent;
