import ContentHeader from '@/components/shared/ContentHeader';
import { Icon } from '@iconify/react';
import { listIcons } from '../constant';
import type { TabsType } from '../types';

type TopikPembahasanDetailHeaderProps = {
  tab: TabsType;
  namaTopik: string;
  statusToDoList: {
    DONE: number;
    INPROGRESS: number;
    DO: number;
  };
  totalDiscussions: number;
};

const TopikPembahasanDetailHeader = ({ tab, namaTopik, statusToDoList, totalDiscussions }: TopikPembahasanDetailHeaderProps) => {
  const { DONE, INPROGRESS, DO } = statusToDoList;

  return (
    <ContentHeader title={`${namaTopik}`}>
      <div className='flex flex-row gap-6 py-3'>
        {tab === 'todolist' ? (
          <>
            {listIcons.map((item) => (
              <div key={item.label} className='flex flex-row gap-2 justify-center items-center'>
                {item.label === 'Completed' ? <div className='bg-primary rounded-full p-0.5 flex items-center justify-center'>{item.icon}</div> : item.icon}

                <span className='text-primary text-sm'>
                  {item.label === 'Completed' ? String(DONE) : item.label === 'On Progress' ? String(INPROGRESS) : String(DO)} {item.label}
                </span>
              </div>
            ))}
          </>
        ) : (
          <div>
            <Icon icon='flowbite:messages-solid' className='size-6 inline-block mr-2 text-primary' />
            <span className='text-primary'>{totalDiscussions} Discussions</span>
          </div>
        )}
      </div>
    </ContentHeader>
  );
};
export default TopikPembahasanDetailHeader;
