import { getContributionReviewsByStudyGroup, reviewContribution } from '@/api/contribution-review';
import NoData from '@/components/shared/NoData';
import Pagination from '@/components/shared/Pagination';
import Search from '@/components/shared/Search';
import TiptapReadonlyContent from '@/components/shared/TiptapReadonlyContent';
import Title from '@/components/shared/Title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useDebounce } from '@/hooks/use-debounce';
import { extractDiscussionText } from '@/lib/discussion-search';
import type { ApiResponse } from '@/types/api';
import type { ContributionReview, ContributionReviewStatus } from '@/types/contribution-review';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, ClipboardCheck, FileQuestion, Sparkles, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

type ReviewFilter = 'ALL' | ContributionReviewStatus;

const statusOptions: { label: string; value: ReviewFilter }[] = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Reviewed', value: 'REVIEWED' },
];
const REVIEW_PAGE_LIMIT = 10;
const EMPTY_REVIEWS: ContributionReview[] = [];

const formatDateTime = (value: string | null) => {
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

const getReviewPreview = (review: ContributionReview) => {
  const contentText = extractDiscussionText(review.post.konten).replace(/\s+/g, ' ').trim();
  if (contentText.length <= 150) return contentText;
  return `${contentText.slice(0, 150)}...`;
};

const ContributionReviewsSkeleton = () => (
  <div className='space-y-4'>
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {[1, 2, 3].map((item) => (
        <Skeleton key={item} className='h-24 rounded-xl' />
      ))}
    </div>
    <Skeleton className='h-14 rounded-xl' />
    {[1, 2, 3].map((item) => (
      <Skeleton key={item} className='h-48 rounded-xl' />
    ))}
  </div>
);

const SummaryCard = ({ title, value, description, icon: Icon }: { title: string; value: number; description: string; icon: LucideIcon }) => (
  <Card className='border-accent bg-white py-4 shadow-sm'>
    <CardContent className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-xs text-accent'>{title}</p>
        <p className='text-xl font-bold text-primary md:text-2xl'>{value}</p>
        <p className='text-xs text-accent'>{description}</p>
      </div>
      <div className='rounded-xl border border-accent bg-secondary p-3'>
        <Icon className='size-5 text-primary' />
      </div>
    </CardContent>
  </Card>
);

const ContributionReviews = () => {
  const { namaMatkul, idMatkul, namaSg, idSg } = useParams<{ namaMatkul: string; idMatkul: string; namaSg: string; idSg: string }>();
  const [statusFilter, setStatusFilter] = useState<ReviewFilter>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedSearchKeyword = useDebounce(searchKeyword, 350);
  const [page, setPage] = useState(1);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [finalPoints, setFinalPoints] = useState('');
  const [lecturerNote, setLecturerNote] = useState('');
  const queryClient = useQueryClient();

  const studyGroupId = String(idSg);
  const queryParams = {
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page,
    limit: REVIEW_PAGE_LIMIT,
  };
  const queryKey = ['contribution-reviews', studyGroupId, queryParams];
  const summaryQueryKey = ['contribution-reviews', studyGroupId, { summary: true }];

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/dosen/study-groups' },
    { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: 'Review Points' },
  ];

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey,
    queryFn: () => getContributionReviewsByStudyGroup(studyGroupId, queryParams),
  });
  const { data: summaryResponse } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey: summaryQueryKey,
    queryFn: () => getContributionReviewsByStudyGroup(studyGroupId, { page: 1, limit: 100 }),
  });

  const reviews = response?.data ?? EMPTY_REVIEWS;
  const summaryReviews = summaryResponse?.data ?? EMPTY_REVIEWS;
  const pagination = response?.pagination;
  const visibleReviews = useMemo(() => {
    const keyword = debouncedSearchKeyword.trim().toLowerCase();
    if (!keyword) return reviews;

    return reviews.filter((review) => {
      const haystack = `${review.student.nama} ${review.student.nrp} ${review.threadTitle} ${review.assignment} ${extractDiscussionText(review.post.konten)}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [debouncedSearchKeyword, reviews]);

  const selectedReview = useMemo(() => reviews.find((review) => review.id === selectedReviewId) ?? null, [reviews, selectedReviewId]);

  const summary = useMemo(() => {
    const pending = summaryReviews.filter((review) => review.status === 'PENDING').length;
    const reviewed = summaryReviews.filter((review) => review.status === 'REVIEWED').length;

    return {
      total: summaryResponse?.pagination?.total_items ?? summaryReviews.length,
      pending,
      reviewed,
    };
  }, [summaryResponse?.pagination?.total_items, summaryReviews]);

  const reviewMutation = useMutation({
    mutationFn: ({ reviewId, points, note }: { reviewId: string; points: number; note: string }) =>
      reviewContribution(reviewId, {
        status: 'REVIEWED',
        finalPoints: points,
        lecturerNote: note,
      }),
    onSuccess: (res) => {
      queryClient.setQueryData<ApiResponse<ContributionReview[]>>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          data: oldData.data.map((review) => (review.id === res.data.id ? res.data : review)),
        };
      });
      queryClient.invalidateQueries({ queryKey: ['contribution-reviews', studyGroupId] });

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

  const handleUseAiSuggestion = () => {
    if (!selectedReview) return;

    setFinalPoints(String(selectedReview.aiSuggestedPoints));
    setLecturerNote('Mengikuti rekomendasi AI karena kontribusi sudah sesuai dengan konteks diskusi.');
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

  return (
    <>
      <Title title='Review Points' items={breadcrumbItems} />

      {isLoading ? (
        <ContributionReviewsSkeleton />
      ) : (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <SummaryCard title='Total Review' value={summary.total} description='Semua rekomendasi kontribusi.' icon={ClipboardCheck} />
            <SummaryCard title='Pending' value={summary.pending} description='Menunggu review dosen.' icon={FileQuestion} />
            <SummaryCard title='Reviewed' value={summary.reviewed} description='Sudah memiliki poin final.' icon={CheckCircle2} />
          </div>

          <Card className='border-accent bg-white py-4 shadow-sm'>
            <CardContent className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
              <div className='flex flex-wrap gap-2'>
                {statusOptions.map((option) => {
                  const isActive = statusFilter === option.value;

                  return (
                    <Button key={option.value} type='button' variant={isActive ? 'default' : 'outline'} className='text-xs shadow-sm md:text-sm' onClick={() => setStatusFilter(option.value)}>
                      {option.label}
                    </Button>
                  );
                })}
              </div>
              <Search value={searchKeyword} onChange={setSearchKeyword} placeholder='Search mahasiswa/thread...' showButton={false} className='w-full md:w-auto' inputClassName='md:w-80' />
            </CardContent>
          </Card>

          {visibleReviews.length === 0 ? (
            <NoData message='Tidak ada review kontribusi yang sesuai filter.' />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                {visibleReviews.map((review) => (
                  <Card key={review.id} className='border-accent bg-white shadow-sm'>
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
                        <p className='text-xs text-accent'>Dibuat: {formatDateTime(review.createdAt)}</p>
                        <Button type='button' className='text-xs shadow-sm md:text-sm' onClick={() => openReviewDialog(review)}>
                          {review.status === 'PENDING' ? 'Review Points' : 'Lihat Detail'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {pagination && (
                <div className='flex justify-center py-4'>
                  <Pagination page={pagination.page} totalPages={pagination.total_pages} onPageChange={setPage} siblingCount={0} disabled={isLoading} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <Dialog open={Boolean(selectedReview)} onOpenChange={(open) => !open && setSelectedReviewId(null)}>
        <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-3xl'>
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle className='text-primary'>Review Points</DialogTitle>
                <DialogDescription>
                  {selectedReview.student.nama} - {selectedReview.threadTitle}
                </DialogDescription>
              </DialogHeader>

              <div className='space-y-5'>
                <div className='rounded-xl border border-accent bg-white p-4 shadow-sm'>
                  <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-primary'>Konten Diskusi</p>
                  <TiptapReadonlyContent content={selectedReview.post.konten} className='text-xs text-primary md:text-sm' />
                </div>

                <div className='rounded-xl border border-accent bg-secondary p-4'>
                  <div className='mb-2 flex items-center gap-2'>
                    <Sparkles className='size-4 text-primary' />
                    <p className='text-xs font-semibold uppercase tracking-wide text-primary'>Rekomendasi AI</p>
                  </div>
                  <p className='text-sm font-bold text-primary'>{selectedReview.aiSuggestedPoints} points</p>
                  <p className='mt-2 text-xs leading-relaxed text-primary md:text-sm'>{selectedReview.aiReason}</p>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]'>
                  <label className='space-y-2'>
                    <span className='text-xs font-semibold text-primary md:text-sm'>Final Points</span>
                    <Input type='number' min={0} value={finalPoints} onChange={(event) => setFinalPoints(event.target.value)} disabled={selectedReview.status === 'REVIEWED' || reviewMutation.isPending} className='border-accent' />
                  </label>

                  <label className='space-y-2'>
                    <span className='text-xs font-semibold text-primary md:text-sm'>Catatan Dosen</span>
                    <Textarea
                      value={lecturerNote}
                      onChange={(event) => setLecturerNote(event.target.value)}
                      disabled={selectedReview.status === 'REVIEWED' || reviewMutation.isPending}
                      className='min-h-24 border-accent text-xs md:text-sm'
                    />
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button type='button' variant='outline' className='shadow-sm' onClick={() => setSelectedReviewId(null)} disabled={reviewMutation.isPending}>
                  Tutup
                </Button>
                {selectedReview.status === 'PENDING' && (
                  <>
                    <Button type='button' variant='secondary' className='border border-accent bg-secondary shadow-sm' onClick={handleUseAiSuggestion} disabled={reviewMutation.isPending}>
                      Gunakan Rekomendasi AI
                    </Button>
                    <Button type='button' className='shadow-sm' onClick={handleSaveReview} disabled={reviewMutation.isPending}>
                      {reviewMutation.isPending ? 'Menyimpan...' : 'Simpan Review'}
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContributionReviews;
