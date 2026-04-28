import { extractDiscussionText } from '@/lib/discussion-search';
import type { ContributionReview } from '@/types/contribution-review';
import type { ContributionReviewSummary } from './types';

export const getVisibleReviews = (reviews: ContributionReview[], keyword: string) => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return reviews;

  return reviews.filter((review) => {
    const haystack = `${review.student.nama} ${review.student.nrp} ${review.threadTitle} ${review.assignment} ${extractDiscussionText(review.post.konten)}`.toLowerCase();
    return haystack.includes(normalizedKeyword);
  });
};

export const getReviewSummary = (reviews: ContributionReview[], totalItems?: number): ContributionReviewSummary => {
  const pending = reviews.filter((review) => review.status === 'PENDING').length;
  const reviewed = reviews.filter((review) => review.status === 'REVIEWED').length;

  return {
    total: totalItems ?? reviews.length,
    pending,
    reviewed,
  };
};
