import TaskFilterDropdown, { type TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Task } from '@/types/task';
import { Icon } from '@iconify/react';
import type { TabsType } from '../types';
import ToDoListContent from './ToDoListContent';

type TopikPembahasanDetailTabsProps = {
  tab: TabsType;
  setTab: (tab: TabsType) => void;
  tasks: Task[];
  tasksIsLoading: boolean;
  tasksIsError: boolean;
  tasksError: Error | null;
  filters: TaskFilterValue;
  setFilters: (value: TaskFilterValue) => void;
};

const TopikPembahasanDetailTabs = ({ tab, setTab, tasks, tasksIsLoading, tasksIsError, tasksError, filters, setFilters }: TopikPembahasanDetailTabsProps) => {
  const memberOptions = Array.from(new Map(tasks.flatMap((t) => t.mahasiswa).map((m) => [m.id, { id: m.id, nama: m.nama }])).values());

  return (
    <div className='w-full'>
      <Tabs value={tab} onValueChange={(v) => setTab(v as TabsType)} className='w-full'>
        <div className='flex w-full items-center justify-between gap-4 flex-wrap'>
          <TabsList variant={'line'} className='gap-8'>
            <TabsTrigger value='todolist'>To Do List</TabsTrigger>
            <TabsTrigger value='discussion'>Discussion</TabsTrigger>
          </TabsList>

          {tab === 'todolist' ? (
            <TaskFilterDropdown value={filters} onValueChange={setFilters} members={memberOptions} label='Filter by..' />
          ) : (
            <Button className='shadow-sm'>
              <Icon icon='flowbite:messages-solid' className='size-4' />
              New Discussion
            </Button>
          )}
        </div>

        <TabsContent value='todolist'>
          <ToDoListContent tasks={tasks} tasksIsLoading={tasksIsLoading} tasksIsError={tasksIsError} tasksError={tasksError} filters={filters} />
        </TabsContent>
        <TabsContent value='discussion'>{/* buat discussion */}</TabsContent>
      </Tabs>
    </div>
  );
};

export default TopikPembahasanDetailTabs;
