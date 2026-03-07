import { getStudyGroupById } from '@/api/study-group';
import TopikDetailContentBase from '@/components/shared/TopikDetail/TopikDetailContentBase';
import type { ApiResponse } from '@/types/api';
import type { AnggotaStudyGroup, StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import TopikPembahasanDetailTabs from './Tabs';

type TopikDetailContentProps = {
  idTopik: string;
  namaTopik: string;
  idSg: string;
};

const TopikDetailContent = ({ idTopik, namaTopik, idSg }: TopikDetailContentProps) => {
  const { data: membersData } = useQuery<ApiResponse<StudyGroupDetail>, Error, AnggotaStudyGroup[]>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    select: (res) => res.data.anggota ?? [],
  });

  return (
    <TopikDetailContentBase
      idTopik={idTopik}
      namaTopik={namaTopik}
      renderTabs={({ tab, onTabChange, filters, onFiltersChange, discussionDateFilter, onDiscussionDateFilterChange, tasksQuery, threadDetailQuery }) => (
        <TopikPembahasanDetailTabs
          tab={tab}
          changeTab={onTabChange}
          filters={filters}
          onFiltersChange={onFiltersChange}
          discussionDateFilter={discussionDateFilter}
          onDiscussionDateFilterChange={onDiscussionDateFilterChange}
          tasksQuery={tasksQuery}
          members={membersData ?? []}
          threadId={idTopik}
          threadDetailQuery={threadDetailQuery}
          studyGroupId={idSg}
        />
      )}
    />
  );
};

export default TopikDetailContent;
