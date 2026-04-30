import NoData from '@/components/shared/NoData';
import Pagination from '@/components/shared/Pagination';
import type { ContributionReview } from '@/types/contribution-review';
import ContributionReviewCard from './ContributionReviewCard';
import type { ContributionReviewPagination } from '../utils/types';

type ContributionReviewListProps = {
  reviews: ContributionReview[];
  pagination?: ContributionReviewPagination;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onOpenReview: (review: ContributionReview) => void;
};

const ContributionReviewList = ({ reviews, pagination, isLoading, onPageChange, onOpenReview }: ContributionReviewListProps) => {
  if (reviews.length === 0) return <NoData message='Tidak ada review kontribusi yang sesuai filter.' />;

  return (
    <>
      <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
        {reviews.map((review) => (
          <ContributionReviewCard key={review.id} review={review} onOpenReview={onOpenReview} />
        ))}
      </div>

      {pagination && (
        <div className='flex justify-center py-4'>
          <Pagination page={pagination.page} totalPages={pagination.total_pages} onPageChange={onPageChange} siblingCount={0} disabled={isLoading} />
        </div>
      )}
    </>
  );
};

export default ContributionReviewList;
