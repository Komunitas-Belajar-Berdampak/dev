import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import TaskFilterDropdown from '@/components/shared/Filter/TaskFilterDropdown';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Task } from '@/types/task';
import { Icon } from '@iconify/react';
import type { TabsType } from '../types';
import ToDoListContent from './ToDoListContent';

type TopikPembahasanDetailTabsProps = {
  tab: TabsType;
  onTabChange: (tab: TabsType) => void;
  filters: TaskFilterValue;
  onFiltersChange: (value: TaskFilterValue) => void;
  tasksQuery: {
    data: Task[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const TopikPembahasanDetailTabs = ({ tab, onTabChange, filters, onFiltersChange, tasksQuery }: TopikPembahasanDetailTabsProps) => {
  const memberOptions = Array.from(new Map(tasksQuery.data.flatMap((t) => t.mahasiswa).map((m) => [m.id, { id: m.id, nama: m.nama }])).values());

  return (
    <div className='w-full'>
      <Tabs value={tab} onValueChange={(v) => onTabChange(v as TabsType)} className='w-full'>
        <div className='flex w-full items-center justify-between gap-4 flex-wrap'>
          <TabsList variant={'line'} className='gap-8'>
            <TabsTrigger value='todolist'>To Do List</TabsTrigger>
            <TabsTrigger value='discussion'>Discussion</TabsTrigger>
          </TabsList>

          {tab === 'todolist' ? (
            <TaskFilterDropdown value={filters} onValueChange={onFiltersChange} members={memberOptions} label='Filter by..' />
          ) : (
            <Button className='shadow-sm'>
              <Icon icon='flowbite:messages-solid' className='size-4' />
              New Discussion
            </Button>
          )}
        </div>

        <TabsContent value='todolist'>
          <ToDoListContent filters={filters} tasksQuery={tasksQuery} />
        </TabsContent>
        <TabsContent value='discussion'>{/* buat discussion */}</TabsContent>
      </Tabs>
    </div>
  );
};

export default TopikPembahasanDetailTabs;
