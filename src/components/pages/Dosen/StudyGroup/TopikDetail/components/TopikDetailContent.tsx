import { useState } from 'react';
import type { TabsType } from '../types';
import TopikPembahasanDetailHeader from './Header';
import TopikPembahasanDetailTabs from './Tabs';

type TopikPembahasanDetailContentProps = {
  idTopik: string;
};

const TopikPembahasanDetailContent = ({ idTopik }: TopikPembahasanDetailContentProps) => {
  const [tab, setTab] = useState<TabsType>('todolist');

  const changeTab = (newTab: TabsType) => {
    setTab(newTab);
  };

  return (
    <>
      {/* kotak title */}
      <TopikPembahasanDetailHeader tab={tab} />

      {/* Tabs */}
      <TopikPembahasanDetailTabs tab={tab} setTab={changeTab} />
    </>
  );
};
export default TopikPembahasanDetailContent;
