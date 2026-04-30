import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import ContributionReviewDialog from './components/ContributionReviewDialog';
import ContributionReviewFilters from './components/ContributionReviewFilters';
import ContributionReviewList from './components/ContributionReviewList';
import ContributionReviewSummaryCards from './components/ContributionReviewSummaryCards';
import ContributionReviewsSkeleton from './components/ContributionReviewsSkeleton';
import { useContributionReviewPage } from './hooks/useContributionReviewPage';

const ContributionReviews = () => {
  const { namaMatkul, idMatkul, namaSg, idSg } = useParams<{ namaMatkul: string; idMatkul: string; namaSg: string; idSg: string }>();
  const studyGroupId = String(idSg);

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/dosen/study-groups' },
    { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: 'Review Points' },
  ];

  const reviewPage = useContributionReviewPage(studyGroupId);

  return (
    <>
      <Title title='Review Points' items={breadcrumbItems} />

      {reviewPage.isLoading ? (
        <ContributionReviewsSkeleton />
      ) : (
        <div className='space-y-6'>
          <ContributionReviewSummaryCards summary={reviewPage.summary} />
          <ContributionReviewFilters statusFilter={reviewPage.statusFilter} searchKeyword={reviewPage.searchKeyword} onStatusFilterChange={reviewPage.setStatusFilter} onSearchKeywordChange={reviewPage.setSearchKeyword} />
          <ContributionReviewList reviews={reviewPage.visibleReviews} pagination={reviewPage.pagination} isLoading={reviewPage.isLoading} onPageChange={reviewPage.setPage} onOpenReview={reviewPage.openReviewDialog} />
        </div>
      )}

      <ContributionReviewDialog
        review={reviewPage.selectedReview}
        finalPoints={reviewPage.finalPoints}
        lecturerNote={reviewPage.lecturerNote}
        isSaving={reviewPage.isSaving}
        onOpenChange={(open) => !open && reviewPage.closeReviewDialog()}
        onFinalPointsChange={reviewPage.setFinalPoints}
        onLecturerNoteChange={reviewPage.setLecturerNote}
        onUseAiSuggestion={reviewPage.handleUseAiSuggestion}
        onSaveReview={reviewPage.handleSaveReview}
      />
    </>
  );
};

export default ContributionReviews;
