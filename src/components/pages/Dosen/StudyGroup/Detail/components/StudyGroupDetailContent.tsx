import { getStudyGroupById } from '@/api/study-group';
import ContentHeader from '@/components/shared/ContentHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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

  if (isLoading) return <StudyGroupDetailContentSkeleton />;

  return (
    <>
      {/* kotak title */}
      <ContentHeader title={namaSg}>
        <p className='text-primary tracking-wide'>{data?.deskripsi || 'Tidak ada deskripsi tersedia.'}</p>
      </ContentHeader>

      {/* 3 opsi tabs*/}
      <Tabs defaultValue='request-join'>
        <TabsList variant={'line'} className='w-full flex-wrap justify-start gap-4 mb-12 md:mb-0'>
          <TabsTrigger value='request-join' className='flex-none whitespace-normal text-left sm:whitespace-nowrap'>
            Request Join
          </TabsTrigger>
          <TabsTrigger value='members' className='flex-none whitespace-normal text-left sm:whitespace-nowrap'>
            Dashboard Kontribusi
          </TabsTrigger>
          <TabsTrigger value='topik-pembahasan' className='flex-none whitespace-normal text-left sm:whitespace-nowrap'>
            Topik Pembahasan
          </TabsTrigger>
        </TabsList>
        <TabsContent value='request-join'>
          {/* buat request join */}
          <RequestJoinContent idSg={idSg} />
        </TabsContent>
        <TabsContent value='members'>
          {/* dashboard kontribusi */}
          <DashboardKontribusiContent totalKontribusi={data?.totalKontribusi ?? 0} anggota={data?.anggota ?? []} />
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
