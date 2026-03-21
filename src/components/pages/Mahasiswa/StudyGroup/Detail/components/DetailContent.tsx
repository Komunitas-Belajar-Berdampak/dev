import { getStudyGroupById, quickEditStudyGroupById } from '@/api/study-group';
import DashboardKontribusiContent from '@/components/pages/Dosen/StudyGroup/Detail/components/DashboardKontribusiContent';
import StudyGroupDetailContentSkeleton from '@/components/pages/Dosen/StudyGroup/Detail/components/StudyGroupDetailContentSkeleton';
import ContentHeader from '@/components/shared/ContentHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StudyGroupQuickEditSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupDetail } from '@/types/sg';
import { Icon } from '@iconify/react';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import DialogEditSg from '../../List/components/DialogEditSg';
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
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<ApiResponse<StudyGroupDetail>, Error, StudyGroupDetail>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    select: (res) => res.data,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { mutate: saveEdit, isPending: isSavingEdit } = useMutation({
    mutationFn: async (values: StudyGroupQuickEditSchemaType) => quickEditStudyGroupById(idSg, values),
    onSuccess: async (res) => {
      toast.success(res.message || 'Study group berhasil diedit.', { toasterId: 'global' });
      setOpenDialog(!openDialog);
      queryClient.invalidateQueries({ queryKey: ['sg-detail', idSg] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengedit study group.', { toasterId: 'global' });
    },
  });

  const handleSave = (values: StudyGroupQuickEditSchemaType) => {
    saveEdit(values);
  };

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil detail study group.', { toasterId: 'global' });
  }, [error?.message, isError]);

  if (isLoading) return <StudyGroupDetailContentSkeleton />;

  return (
    <>
      {/* Setting Button */}
      <div className='flex justify-end w-full mb-2'>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button variant={'ghost'} size={'icon-lg'} className='group shadow-none border border-accent'>
              <Settings className='size-4 md:size-5 text-muted-foreground transition-colors group-hover:text-primary' />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogEditSg defaultValues={{ nama: data?.nama, deskripsi: data?.deskripsi }} isPending={isSavingEdit} onSave={handleSave} />
          </DialogContent>
        </Dialog>
      </div>

      <ContentHeader title={namaSg}>
        <p className='text-sm md:text-base text-primary tracking-wide'>{data?.deskripsi || 'Deskripsi study group belum tersedia.'}</p>
      </ContentHeader>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as typeof tab);
          if (v !== 'topik-pembahasan') setIsAddThreadOpen(false);
        }}
      >
        <div className='flex items-center justify-between gap-4 flex-wrap'>
          <TabsList variant={'line'} className='gap-8 '>
            <TabsTrigger value='members' className='text-xs md:text-sm'>
              Dashboard Kontribusi
            </TabsTrigger>
            <TabsTrigger value='topik-pembahasan' className='text-xs md:text-sm'>
              Topik Pembahasan
            </TabsTrigger>
          </TabsList>

          {tab === 'topik-pembahasan' && (
            <Button type='button' variant='default' className='text-xs md:text-sm shadow-sm border px-5' onClick={() => setIsAddThreadOpen(true)}>
              <Icon icon='flowbite:messages-solid' className='size-4.5 text-white' />
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
