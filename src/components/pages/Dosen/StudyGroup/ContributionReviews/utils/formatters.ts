import { extractDiscussionText } from '@/lib/discussion-search';
import type { ContributionReview } from '@/types/contribution-review';

export const formatReviewDateTime = (value: string | null) => {
  if (!value) return '-';

  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
};

export const getReviewPreview = (review: ContributionReview) => {
  const contentText = extractDiscussionText(review.post.konten).replace(/\s+/g, ' ').trim();
  if (contentText.length <= 150) return contentText;
  return `${contentText.slice(0, 150)}...`;
};
