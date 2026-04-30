import { api } from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { ContributionReview, ContributionReviewQueryParams, ReviewContributionPayload } from '@/types/contribution-review';

const getContributionReviewsByStudyGroup = async (studyGroupId: string, params: ContributionReviewQueryParams = {}): Promise<ApiResponse<ContributionReview[]>> => {
  const res = await api.get<ApiResponse<ContributionReview[]>>(`/contribution-reviews/sg/${studyGroupId}`, { params });
  return res.data;
};

const reviewContribution = async (idReview: string, payload: ReviewContributionPayload): Promise<ApiResponse<ContributionReview | null>> => {
  const res = await api.patch<ApiResponse<ContributionReview | null>>(`/contribution-reviews/${idReview}`, payload);

  return {
    ...res.data,
    data: res.data.data ?? null,
  };
};

export { getContributionReviewsByStudyGroup, reviewContribution };
