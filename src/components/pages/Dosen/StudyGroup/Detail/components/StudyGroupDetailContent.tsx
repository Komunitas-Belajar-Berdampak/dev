import { getContributionReviewsByStudyGroup } from '@/api/contribution-review';
import { getStudyGroupById } from '@/api/study-group';
import ContentHeader from '@/components/shared/ContentHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiResponse } from '@/types/api';
import type { ContributionReview } from '@/types/contribution-review';
import type { StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { ClipboardCheck } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import DashboardKontribusiContent from './DashboardKontribusiContent';
import RequestJoinContent from './RequestJoinContent';
import StudyGroupDetailContentSkeleton from './StudyGroupDetailContentSkeleton';
import TopikPembahasanContent from './TopikPembahasanContent';

type StudyGroupDetailContentProps = {
  idSg: string;
  namaSg: string;
};

const StudyGroupDetailContent = ({ idSg, namaSg }: StudyGroupDetailContentProps) => {
  const { data, isLoading, isError, error } = useQuery<ApiResponse<StudyGroupDetail>, Error, StudyGroupDetail>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    select: (res) => res.data,
    staleTime: 0,
    refetchOnMount: 'always',
  });
  const { data: pendingReviewResponse } = useQuery<ApiResponse<ContributionReview[]>, Error>({
    queryKey: ['contribution-reviews', idSg, { status: 'PENDING', page: 1, limit: 1 }],
    queryFn: () => getContributionReviewsByStudyGroup(idSg, { status: 'PENDING', page: 1, limit: 1 }),
  });
  const pendingReviews = pendingReviewResponse?.pagination?.total_items ?? 0;

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil detail study group.', { toasterId: 'global' });
  }, [error?.message, isError]);

  const sortedAnggota = useMemo(() => {
    const members = data?.anggota ?? [];
    return [...members].sort((a, b) => b.totalKontribusi - a.totalKontribusi);
  }, [data?.anggota]);

  if (isLoading) return <StudyGroupDetailContentSkeleton />;

  return (
    <>
      {/* kotak title */}
      <ContentHeader title={namaSg}>
        <p className='text-primary tracking-wide'>{data?.deskripsi || 'Tidak ada deskripsi tersedia.'}</p>
      </ContentHeader>

      {/* 3 opsi tabs*/}
      <Tabs defaultValue='request-join' className='w-full min-w-0'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          <div className='w-full max-w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] md:w-auto [&::-webkit-scrollbar]:hidden'>
            <TabsList variant={'line'} className='min-w-max gap-4 md:gap-8 pr-1'>
              <TabsTrigger value='request-join' className='shrink-0 snap-start text-xs md:text-sm'>
                Request Join
              </TabsTrigger>
              <TabsTrigger value='members' className='shrink-0 snap-start text-xs md:text-sm'>
                Dashboard Kontribusi
              </TabsTrigger>
              <TabsTrigger value='topik-pembahasan' className='shrink-0 snap-start text-xs md:text-sm'>
                Topik Pembahasan
              </TabsTrigger>
            </TabsList>
          </div>

          <Link to='contribution-reviews' className='w-full md:w-auto'>
            <Button className='w-full text-xs shadow-sm md:w-auto md:text-sm'>
              <ClipboardCheck className='size-4' />
              Review Points
              {pendingReviews > 0 && (
                <Badge variant='secondary' className='ml-1  bg-white text-primary shadow-none'>
                  {pendingReviews}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
        <TabsContent value='request-join'>
          {/* buat request join */}
          <RequestJoinContent idSg={idSg} />
        </TabsContent>
        <TabsContent value='members'>
          {/* dashboard kontribusi */}
          <DashboardKontribusiContent totalKontribusi={data?.totalKontribusi ?? 0} anggota={sortedAnggota} />
        </TabsContent>
        <TabsContent value='topik-pembahasan'>
          {/* topik pembahasan */}
          <TopikPembahasanContent idSg={idSg} />
        </TabsContent>
      </Tabs>
    </>
  );
};
export default StudyGroupDetailContent;
