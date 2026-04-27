import DiscussionContent from '@/components/pages/Dosen/StudyGroup/TopikDetail/components/DiscussionContent';
import type { TabsType } from '@/components/pages/Dosen/StudyGroup/TopikDetail/types';
import FilterWithInputRange, { type FilterWithInputRangeValue } from '@/components/shared/Filter/FilterWithInputRange';
import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import TaskFilterDropdown from '@/components/shared/Filter/TaskFilterDropdown';
import Search from '@/components/shared/Search';
import TopikDetailStickyToolbar from '@/components/shared/TopikDetail/components/TopikDetailStickyToolbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AnggotaStudyGroup } from '@/types/sg';
import type { Task } from '@/types/task';
import type { ThreadDetail } from '@/types/thread-post';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import ToDoListContent from './ToDoList';

type TabsProp = {
  tab: TabsType;
  changeTab: (newTab: TabsType) => void;
  filters: TaskFilterValue;
  onFiltersChange: (value: TaskFilterValue) => void;
  discussionSearchKeyword: string;
  onDiscussionSearchKeywordChange: (value: string) => void;
  discussionDateFilter: FilterWithInputRangeValue<'all'>;
  onDiscussionDateFilterChange: (value: FilterWithInputRangeValue<'all'>) => void;
  threadId: string;
  studyGroupId: string;
  members: AnggotaStudyGroup[];
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

const TopikPembahasanDetailTabs = ({
  tab,
  changeTab,
  filters,
  studyGroupId,
  onFiltersChange,
  discussionSearchKeyword,
  onDiscussionSearchKeywordChange,
  discussionDateFilter,
  onDiscussionDateFilterChange,
  threadId,
  members,
  tasksQuery,
  threadDetailQuery,
}: TabsProp) => {
  const memberOptions = members.map((m) => ({ id: m.id, nama: m.nama }));

  return (
    <Tabs value={tab} onValueChange={(v) => changeTab(v as TabsType)} className='w-full'>
      <TopikDetailStickyToolbar>
        <TabsList variant={'line'} className='gap-4 md:gap-8'>
          <TabsTrigger value='todolist' className=' text-xs md:text-sm'>
            To Do List
          </TabsTrigger>
          <TabsTrigger value='discussion' className=' text-xs md:text-sm'>
            Discussion
          </TabsTrigger>
        </TabsList>

        {tab === 'todolist' ? (
          <TaskFilterDropdown value={filters} onValueChange={onFiltersChange} members={memberOptions} label='Filter by..' />
        ) : (
          <div className='flex w-full sm:w-auto flex-wrap items-center gap-4'>
            <Search value={discussionSearchKeyword} onChange={onDiscussionSearchKeywordChange} placeholder='Search discussion...' className='min-w-54' showButton={false} />

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
              <Button className='shadow-sm py-5 text-xs md:text-sm'>
                <Icon icon='flowbite:messages-solid' className='size-4.5' />
                New Discussion
              </Button>
            </Link>
          </div>
        )}
      </TopikDetailStickyToolbar>

      <TabsContent value='todolist'>
        <ToDoListContent threadId={threadId} members={members} tasksQuery={tasksQuery} filters={filters} studyGroupId={studyGroupId} />
      </TabsContent>
      <TabsContent value='discussion'>
        <DiscussionContent threadDetailQuery={threadDetailQuery} discussionSearchKeyword={discussionSearchKeyword} />
      </TabsContent>
    </Tabs>
  );
};

export default TopikPembahasanDetailTabs;
