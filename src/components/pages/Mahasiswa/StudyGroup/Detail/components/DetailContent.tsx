import { getStudyGroupById } from '@/api/study-group';
import StudyGroupDetailContentSkeleton from '@/components/pages/Dosen/StudyGroup/Detail/components/StudyGroupDetailContentSkeleton';
import ContentHeader from '@/components/shared/ContentHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import DashboardKontribusiContent from './DashboardKontribusi';
import TopikPembahasanContent from './TopikPembahasan';

type DetailContentProps = {
  idSg: string;
  namaSg: string;
};

const DetailContent = ({ idSg, namaSg }: DetailContentProps) => {
  const { data, isLoading, isError, error } = useQuery<ApiResponse<StudyGroupDetail>, Error, StudyGroupDetail>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil detail study group.', { toasterId: 'global' });
  }, [error?.message, isError]);

  if (isLoading) {
    return <StudyGroupDetailContentSkeleton />;
  }

  return (
    <>
      <ContentHeader title={namaSg}>
        <p className='text-primary tracking-wide'>{data?.deskripsi || 'Deskripsi study group belum tersedia.'}</p>
      </ContentHeader>

      <Tabs defaultValue='members'>
        <TabsList variant={'line'} className='gap-8'>
          <TabsTrigger value='members'>Dashboard Kontribusi</TabsTrigger>
          <TabsTrigger value='topik-pembahasan'>Topik Pembahasan</TabsTrigger>
        </TabsList>
        <TabsContent value='members'>
          {/* dashboard kontribusi */}
          <DashboardKontribusiContent />
        </TabsContent>
        <TabsContent value='topik-pembahasan'>
          {/* topik pembahasan */}
          <TopikPembahasanContent />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DetailContent;
