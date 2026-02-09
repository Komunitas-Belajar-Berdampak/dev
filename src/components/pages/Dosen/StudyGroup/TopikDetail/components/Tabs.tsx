import FilterWithInputRange, { type FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import TaskFilterDropdown from '@/components/shared/Filter/TaskFilterDropdown';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Task } from '@/types/task';
import type { ThreadDetail } from '@/types/thread-post';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import type { TabsType } from '../types';
import DiscussionContent from './DiscussionContent';
import ToDoListContent from './ToDoListContent';

type TopikPembahasanDetailTabsProps = {
  tab: TabsType;
  onTabChange: (tab: TabsType) => void;
  filters: TaskFilterValue;
  onFiltersChange: (value: TaskFilterValue) => void;

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
};

const TopikPembahasanDetailTabs = ({ tab, onTabChange, filters, onFiltersChange, discussionDateFilter, onDiscussionDateFilterChange, tasksQuery, threadDetailQuery }: TopikPembahasanDetailTabsProps) => {
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
            <div className='flex gap-4'>
              <FilterWithInputRange
                value={discussionDateFilter}
                onValueChange={onDiscussionDateFilterChange}
                fields={[{ label: 'Semua', value: 'all' }]}
                showFieldSelect={false}
                showKeywordInput={false}
                label='Date range'
                buttonClassName='py-5'
              />

              <Link to={'new-discussion'}>
                <Button className='shadow-sm py-5'>
                  <Icon icon='flowbite:messages-solid' className='size-4.5' />
                  New Discussion
                </Button>
              </Link>
            </div>
          )}
        </div>

        <TabsContent value='todolist'>
          <ToDoListContent filters={filters} tasksQuery={tasksQuery} />
        </TabsContent>
        <TabsContent value='discussion'>
          <DiscussionContent threadDetailQuery={threadDetailQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopikPembahasanDetailTabs;
