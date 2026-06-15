import TopikDetailContentBase from '@/components/shared/TopikDetail/TopikDetailContentBase';
import TopikPembahasanDetailTabs from './Tabs';

type TopikPembahasanDetailContentProps = {
  idTopik: string;
  namaTopik: string;
  idSg: string;
};

const TopikPembahasanDetailContent = ({ idTopik, namaTopik, idSg }: TopikPembahasanDetailContentProps) => {
  return (
    <TopikDetailContentBase
      idTopik={idTopik}
      namaTopik={namaTopik}
      renderTabs={({
        tab,
        onTabChange,
        filters,
        onFiltersChange,
        discussionSearchKeyword,
        onDiscussionSearchKeywordChange,
        discussionDateFilter,
        onDiscussionDateFilterChange,
        clearDiscussionFilters,
        tasksQuery,
        threadDetailQuery,
      }) => (
        <TopikPembahasanDetailTabs
          tab={tab}
          onTabChange={onTabChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          discussionSearchKeyword={discussionSearchKeyword}
          onDiscussionSearchKeywordChange={onDiscussionSearchKeywordChange}
          discussionDateFilter={discussionDateFilter}
          onDiscussionDateFilterChange={onDiscussionDateFilterChange}
          clearDiscussionFilters={clearDiscussionFilters}
          tasksQuery={tasksQuery}
          threadDetailQuery={threadDetailQuery}
          threadId={idTopik}
          studyGroupId={idSg}
        />
      )}
    />
  );
};
export default TopikPembahasanDetailContent;
