import ContentHeader from '@/components/shared/ContentHeader';
import { listIcons } from '../constant';
import type { TabsType } from '../types';

type TopikPembahasanDetailHeaderProps = {
  tab: TabsType;
};

const TopikPembahasanDetailHeader = ({ tab }: TopikPembahasanDetailHeaderProps) => {
  return (
    <ContentHeader title={`Detail Topik Pembahasan`}>
      <div className='flex flex-row gap-6 py-3'>
        {tab === 'todolist' ? (
          <>
            {listIcons.map((item) => (
              <div key={item.label} className='flex flex-row gap-2 justify-center items-center'>
                {item.label === 'completed' ? <div className='bg-primary rounded-full p-0.5 flex items-center justify-center'>{item.icon}</div> : item.icon}
                <span className='text-primary text-sm'>1 {item.label}</span>
              </div>
            ))}
          </>
        ) : (
          <div></div>
        )}
      </div>
    </ContentHeader>
  );
};
export default TopikPembahasanDetailHeader;
