import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContributionReview } from '@/types/contribution-review';
import { formatReviewDateTime, getReviewPreview } from '../utils/formatters';

type ContributionReviewCardProps = {
  review: ContributionReview;
  onOpenReview: (review: ContributionReview) => void;
};

const ContributionReviewCard = ({ review, onOpenReview }: ContributionReviewCardProps) => (
  <Card className='border-accent bg-white shadow-sm'>
    <CardHeader className='gap-3'>
      <div className='flex flex-wrap items-start justify-between gap-3'>
        <div className='space-y-1'>
          <CardTitle className='text-sm font-bold text-primary md:text-base'>{review.student.nama}</CardTitle>
          <p className='text-xs text-accent md:text-sm'>{review.student.nrp}</p>
        </div>
        <Badge variant={review.status === 'PENDING' ? 'outline' : 'success'} className='shadow-sm'>
          {review.status}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className='space-y-4'>
      <div>
        <p className='text-xs font-semibold text-primary md:text-sm'>{review.threadTitle}</p>
        <p className='text-xs text-accent'>{review.assignment}</p>
      </div>

      <p className='rounded-xl border border-accent bg-secondary p-3 text-xs leading-relaxed text-primary md:text-sm'>{getReviewPreview(review)}</p>

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='rounded-lg border border-accent bg-white p-3 shadow-sm'>
          <p className='text-xs text-accent'>AI Suggested</p>
          <p className='text-sm font-bold text-primary md:text-base'>{review.aiSuggestedPoints} points</p>
        </div>
        <div className='rounded-lg border border-accent bg-white p-3 shadow-sm'>
          <p className='text-xs text-accent'>Final Points</p>
          <p className='text-sm font-bold text-primary md:text-base'>{review.finalPoints ?? '-'} points</p>
        </div>
      </div>

      <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <p className='text-xs text-accent'>Dibuat: {formatReviewDateTime(review.createdAt)}</p>
        <Button type='button' className='text-xs shadow-sm md:text-sm' onClick={() => onOpenReview(review)}>
          {review.status === 'PENDING' ? 'Review Points' : 'Lihat Detail'}
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default ContributionReviewCard;
