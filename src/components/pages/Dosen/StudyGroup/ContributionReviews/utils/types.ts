import type { ContributionReview, ContributionReviewStatus } from '@/types/contribution-review';

export type ReviewFilter = 'ALL' | ContributionReviewStatus;

export type ContributionReviewSummary = {
  total: number;
  pending: number;
  reviewed: number;
};

export type ContributionReviewPagination = {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
};

export type ContributionReviewAction = (review: ContributionReview) => void;
