import { getStudyGroupById } from '@/api/study-group';
import ContentHeader from '@/components/shared/ContentHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
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
        <div className='w-full max-w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden'>
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
