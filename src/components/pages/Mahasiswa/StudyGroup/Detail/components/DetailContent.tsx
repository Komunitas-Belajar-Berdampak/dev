import { getStudyGroupById } from '@/api/study-group';
import DashboardKontribusiContent from '@/components/pages/Dosen/StudyGroup/Detail/components/DashboardKontribusiContent';
import StudyGroupDetailContentSkeleton from '@/components/pages/Dosen/StudyGroup/Detail/components/StudyGroupDetailContentSkeleton';
import ContentHeader from '@/components/shared/ContentHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DialogAddThread from './DialogAddThread';
import TopikPembahasanContent from './TopikPembahasan';

type DetailContentProps = {
  idSg: string;
  namaSg: string;
  idCourse: string;
};

const DetailContent = ({ idSg, namaSg, idCourse }: DetailContentProps) => {
  const [tab, setTab] = useState<'members' | 'topik-pembahasan'>('members');
  const [isAddThreadOpen, setIsAddThreadOpen] = useState(false);

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

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as typeof tab);
          if (v !== 'topik-pembahasan') setIsAddThreadOpen(false);
        }}
      >
        <div className='flex items-center justify-between gap-4'>
          <TabsList variant={'line'} className='gap-8'>
            <TabsTrigger value='members'>Dashboard Kontribusi</TabsTrigger>
            <TabsTrigger value='topik-pembahasan'>Topik Pembahasan</TabsTrigger>
          </TabsList>

          {tab === 'topik-pembahasan' && (
            <Button type='button' variant='default' className='shadow-sm border px-5' onClick={() => setIsAddThreadOpen(true)}>
              New Topic
            </Button>
          )}
        </div>
        <TabsContent value='members'>
          {/* dashboard kontribusi */}
          <DashboardKontribusiContent totalKontribusi={data?.totalKontribusi ?? 0} anggota={data?.anggota ?? []} />
        </TabsContent>
        <TabsContent value='topik-pembahasan'>
          {/* topik pembahasan */}
          <DialogAddThread open={isAddThreadOpen} onOpenChange={setIsAddThreadOpen} idSg={idSg} idCourse={idCourse} />
          <TopikPembahasanContent idSg={idSg} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DetailContent;
