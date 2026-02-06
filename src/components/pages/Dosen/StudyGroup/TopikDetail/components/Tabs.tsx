import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Icon } from '@iconify/react';
import type { TabsType } from '../types';

type TopikPembahasanDetailTabsProps = {
  tab: TabsType;
  setTab: (tab: TabsType) => void;
};

const TopikPembahasanDetailTabs = ({ tab, setTab }: TopikPembahasanDetailTabsProps) => {
  return (
    <div className='flex flex-row w-full justify-between'>
      {/* tab */}
      <Tabs defaultValue={tab}>
        <TabsList variant={'line'} className='gap-8'>
          <TabsTrigger value='todolist' onClick={() => setTab('todolist')}>
            To Do List
          </TabsTrigger>
          <TabsTrigger value='discussion' onClick={() => setTab('discussion')}>
            Discussion
          </TabsTrigger>
        </TabsList>
        <TabsContent value='todolist'>{/* buat todolist */}</TabsContent>
        <TabsContent value='discussion'>{/* buat discussion */}</TabsContent>
      </Tabs>

      {/* filter / button */}
      {tab === 'todolist' ? (
        <div>
            
        </div>
      ) : (
        <div className='flex flex-row gap-4'>
          {/* filter */}

          {/* button */}
          <Button className='shadow-sm'>
            <Icon icon='flowbite:messages-solid' className='size-4' />
            New Discussion
          </Button>
        </div>
      )}
    </div>
  );
};

export default TopikPembahasanDetailTabs;
