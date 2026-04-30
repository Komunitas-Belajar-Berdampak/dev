import { getContributionReviewsByStudyGroup, reviewContribution } from '@/api/contribution-review';
import { useDebounce } from '@/hooks/use-debounce';
import type { ApiResponse } from '@/types/api';
import type { ContributionReview } from '@/types/contribution-review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { EMPTY_REVIEWS, REVIEW_PAGE_LIMIT } from '../utils/constants';
import { getVisibleReviews } from '../utils/review-calculations';
import type { ReviewFilter } from '../utils/types';

export const useContributionReviewPage = (studyGroupId: string) => {
  const [statusFilter, setStatusFilter] = useState<ReviewFilter>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedSearchKeyword = useDebounce(searchKeyword, 350);
  const [page, setPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [finalPoints, setFinalPoints] = useState('');
  const [lecturerNote, setLecturerNote] = useState('');
  const queryClient = useQueryClient();

  const queryParams = useMemo(
    () => ({
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      page,
      limit: REVIEW_PAGE_LIMIT,
    }),
    [page, statusFilter],
  );
  const queryKey = useMemo(() => ['contribution-reviews', studyGroupId, queryParams], [queryParams, studyGroupId]);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey,
    queryFn: () => getContributionReviewsByStudyGroup(studyGroupId, queryParams),
  });
  const { data: totalSummaryResponse } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey: ['contribution-reviews', studyGroupId, { summary: 'ALL' }],
    queryFn: () => getContributionReviewsByStudyGroup(studyGroupId, { page: 1, limit: 1 }),
  });
  const { data: pendingSummaryResponse } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey: ['contribution-reviews', studyGroupId, { summary: 'PENDING' }],
    queryFn: () => getContributionReviewsByStudyGroup(studyGroupId, { status: 'PENDING', page: 1, limit: 1 }),
  });
  const { data: reviewedSummaryResponse } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey: ['contribution-reviews', studyGroupId, { summary: 'REVIEWED' }],
    queryFn: () => getContributionReviewsByStudyGroup(studyGroupId, { status: 'REVIEWED', page: 1, limit: 1 }),
  });

  const reviews = response?.data ?? EMPTY_REVIEWS;
  const pagination = response?.pagination;
  const visibleReviews = useMemo(() => getVisibleReviews(reviews, debouncedSearchKeyword), [debouncedSearchKeyword, reviews]);
  const selectedReview = useMemo(() => reviews.find((review) => review.id === selectedReviewId) ?? null, [reviews, selectedReviewId]);
  const summary = useMemo(
    () => ({
      total: totalSummaryResponse?.pagination?.total_items ?? 0,
      pending: pendingSummaryResponse?.pagination?.total_items ?? 0,
      reviewed: reviewedSummaryResponse?.pagination?.total_items ?? 0,
    }),
    [pendingSummaryResponse?.pagination?.total_items, reviewedSummaryResponse?.pagination?.total_items, totalSummaryResponse?.pagination?.total_items],
  );

  const reviewMutation = useMutation({
    mutationFn: ({ reviewId, points, note }: { reviewId: string; points: number; note: string }) =>
      reviewContribution(reviewId, {
        status: 'REVIEWED',
        finalPoints: points,
        lecturerNote: note,
      }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['contribution-reviews', studyGroupId] });
      queryClient.invalidateQueries({ queryKey: ['study-group-member-by-id'] });

      toast.success(res.message || 'Review kontribusi berhasil disimpan.', { toasterId: 'global' });
      setSelectedReviewId(null);
    },
    onError: (mutationError: Error) => {
      toast.error(mutationError.message || 'Gagal menyimpan review kontribusi.', { toasterId: 'global' });
    },
  });

  const openReviewDialog = (review: ContributionReview) => {
    setSelectedReviewId(review.id);
    setFinalPoints(String(review.finalPoints ?? review.aiSuggestedPoints));
    setLecturerNote(review.lecturerNote ?? '');
  };

  const closeReviewDialog = () => {
    setSelectedReviewId(null);
  };

  const handleUseAiSuggestion = () => {
    if (!selectedReview) return;

    setFinalPoints(String(selectedReview.aiSuggestedPoints));
    setLecturerNote(selectedReview.aiReason);
  };

  const handleSaveReview = () => {
    if (!selectedReview) return;

    const parsedPoints = Number(finalPoints);
    const trimmedNote = lecturerNote.trim();

    if (!Number.isFinite(parsedPoints) || parsedPoints < 0) {
      toast.error('Final points harus berupa angka minimal 0.', { toasterId: 'global' });
      return;
    }

    if (!trimmedNote) {
      toast.error('Catatan dosen wajib diisi agar penilaian bisa dipertanggungjawabkan.', { toasterId: 'global' });
      return;
    }

    reviewMutation.mutate({
      reviewId: selectedReview.id,
      points: parsedPoints,
      note: trimmedNote,
    });
  };

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data review kontribusi.', { toasterId: 'global' });
  }, [error?.message, isError]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return {
    statusFilter,
    searchKeyword,
    page,
    selectedReview,
    finalPoints,
    lecturerNote,
    isLoading,
    isSaving: reviewMutation.isPending,
    summary,
    visibleReviews,
    pagination,
    setStatusFilter,
    setSearchKeyword,
    setPage,
    setFinalPoints,
    setLecturerNote,
    openReviewDialog,
    closeReviewDialog,
    handleUseAiSuggestion,
    handleSaveReview,
  };
};
