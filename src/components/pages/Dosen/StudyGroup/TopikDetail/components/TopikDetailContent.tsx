import TopikDetailContentBase from '@/components/shared/TopikDetail/TopikDetailContentBase';
import TopikPembahasanDetailTabs from './Tabs';

type TopikPembahasanDetailContentProps = {
  idTopik: string;
  namaTopik: string;
};

const TopikPembahasanDetailContent = ({ idTopik, namaTopik }: TopikPembahasanDetailContentProps) => {
  return (
    <TopikDetailContentBase
      idTopik={idTopik}
      namaTopik={namaTopik}
      renderTabs={({ tab, onTabChange, filters, onFiltersChange, discussionSearchKeyword, onDiscussionSearchKeywordChange, discussionDateFilter, onDiscussionDateFilterChange, tasksQuery, threadDetailQuery }) => (
        <TopikPembahasanDetailTabs
          tab={tab}
          onTabChange={onTabChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          discussionSearchKeyword={discussionSearchKeyword}
          onDiscussionSearchKeywordChange={onDiscussionSearchKeywordChange}
          discussionDateFilter={discussionDateFilter}
          onDiscussionDateFilterChange={onDiscussionDateFilterChange}
          tasksQuery={tasksQuery}
          threadDetailQuery={threadDetailQuery}
        />
      )}
    />
  );
};
export default TopikPembahasanDetailContent;
