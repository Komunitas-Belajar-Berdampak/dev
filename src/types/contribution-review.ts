import type { JSONContent } from '@tiptap/react';

export type ContributionReviewStatus = 'PENDING' | 'REVIEWED';

export type ContributionReview = {
  id: string;
  post: {
    id: string;
    konten: JSONContent;
    createdAt: string;
    updatedAt: string;
  };
  threadId: string;
  threadTitle: string;
  assignment: string;
  student: {
    id: string;
    nrp: string;
    nama: string;
  };
  aiSuggestedPoints: number;
  aiReason: string;
  finalPoints: number | null;
  lecturerNote: string | null;
  status: ContributionReviewStatus;
  createdAt: string;
  reviewedAt: string | null;
};

export type ReviewContributionPayload = {
  status: 'REVIEWED';
  finalPoints: number;
  lecturerNote: string;
};

export type ContributionReviewQueryParams = {
  status?: ContributionReviewStatus;
  page?: number;
  limit?: number;
};
