import type { ContributionReview } from '@/types/contribution-review';
import type { ReviewFilter } from './types';

export const REVIEW_PAGE_LIMIT = 10;

export const EMPTY_REVIEWS: ContributionReview[] = [];

export const statusOptions: { label: string; value: ReviewFilter }[] = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Reviewed', value: 'REVIEWED' },
];
