import { joinMembershipRequest } from '@/api/membership';
import { quickEditStudyGroupById } from '@/api/study-group';
import { Button } from '@/components/ui/button';
import Circle from '@/components/ui/circle';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { StudyGroupQuickEditSchemaType } from '@/schemas/sg';
import type { StudyGroupByMembership } from '@/types/sg';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { listOption } from '../constant';
import { getStudyGroupAction } from '../utils/getStudyGroupAction';
import DialogEditSg from './DialogEditSg';
import DialogRequest from './DialogRequest';

type StudyGroupListProps = {
  studygroups: StudyGroupByMembership[];
  courseId: string;
  page: number;
};

type activeDialogType =
  | {
      type: 'request';
      id: string;
      name: string;
    }
  | {
      type: 'edit';
      id: string;
      name: string;
      deskripsi: string;
    };

const ListItem = ({ studygroups, courseId, page }: StudyGroupListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeDialog, setActiveDialog] = useState<null | activeDialogType>(null);

  const iconByLabel = useMemo(() => new Map(listOption.map((o) => [o.label, o.icon] as const)), []);

  const { mutate: requestJoin, isPending: isRequestingJoin } = useMutation({
    mutationFn: (studyGroupId: string) => joinMembershipRequest(studyGroupId),
    onSuccess: async (res) => {
      toast.success(res.message || 'Request join berhasil dikirim.', { toasterId: 'global' });
      await queryClient.invalidateQueries({ queryKey: ['sg-by-course-memberships', courseId, page], exact: true });
      setActiveDialog(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengirim request join.', { toasterId: 'global' });
    },
  });

  const { mutate: saveEdit, isPending: isSavingEdit } = useMutation({
    mutationFn: async (values: StudyGroupQuickEditSchemaType) => {
      if (!activeDialog || activeDialog.type !== 'edit') throw new Error('Study group tidak ditemukan.');
      return quickEditStudyGroupById(activeDialog.id, values);
    },
    onSuccess: async (res) => {
      toast.success(res.message || 'Study group berhasil diedit.', { toasterId: 'global' });
      const sgId = activeDialog?.type === 'edit' ? activeDialog.id : undefined;
      setActiveDialog(null);
      await Promise.all([queryClient.invalidateQueries({ queryKey: ['sg-by-course-memberships', courseId, page], exact: true }), sgId ? queryClient.invalidateQueries({ queryKey: ['sg-detail', sgId] }) : Promise.resolve()]);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengedit study group.', { toasterId: 'global' });
    },
  });

  return (
    <>
      <div className='flex flex-col w-full gap-4 py-10'>
        {studygroups.map((sg) => (
          <Fragment key={sg.id}>
            {(() => {
              const action = getStudyGroupAction(sg);
              const icon = action.kind === 'none' ? null : iconByLabel.get(action.label);

              const actionButton =
                action.kind === 'none' ? null : (
                  <Button
                    variant={'ghost'}
                    size={'icon-sm'}
                    className='text-sm underline ml-2'
                    disabled={action.disabled || (action.kind === 'request' && isRequestingJoin)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (action.kind === 'request') {
                        setActiveDialog({ type: 'request', id: sg.id, name: sg.nama });
                        return;
                      }
                      if (action.kind === 'edit') {
                        setActiveDialog({ type: 'edit', id: sg.id, name: sg.nama, deskripsi: sg.deskripsi ?? '' });
                      }
                    }}
                    onKeyDown={(e) => e.stopPropagation()}
                    aria-label={action.label}
                  >
                    {icon}
                  </Button>
                );

              return (
                <div
                  className={`flex gap-6 items-center w-full ${action.kind === 'edit' ? 'cursor-pointer' : 'cursor-default'}`}
                  role='link'
                  tabIndex={action.kind === 'edit' ? 0 : -1}
                  onClick={
                    action.kind === 'edit'
                      ? () => {
                          navigate(`${sg.nama}/${sg.id}`);
                        }
                      : undefined
                  }
                  onKeyDown={
                    action.kind === 'edit'
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`${sg.nama}/${sg.id}`);
                          }
                        }
                      : undefined
                  }
                >
                  <div>
                    <Circle />
                  </div>

                  <div className='w-full flex flex-col'>
                    <div className='flex flex-row items-center justify-between'>
                      <p className='text-primary font-bold text-sm'>{sg.nama}</p>
                      <p className='text-primary font-bold text-sm'>{sg.totalKontribusi} points</p>
                    </div>

                    <div className='flex flex-row items-center justify-between'>
                      <p className='text-accent text-sm'>
                        {sg.totalAnggota} / {sg.kapasitas} Anggota
                      </p>

                      {actionButton}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className='border-t border-accent w-full' />
          </Fragment>
        ))}
      </div>

      <Dialog open={Boolean(activeDialog)} onOpenChange={(next) => (!next ? setActiveDialog(null) : null)}>
        <DialogContent className='rounded-xl'>
          {activeDialog?.type === 'request' ? (
            <DialogRequest studyGroupName={activeDialog.name} isPending={isRequestingJoin} onRequest={() => requestJoin(activeDialog.id)} />
          ) : activeDialog?.type === 'edit' ? (
            <DialogEditSg
              defaultValues={{
                nama: activeDialog.name,
                deskripsi: activeDialog.deskripsi ?? '',
              }}
              isPending={isSavingEdit}
              onSave={(values) => saveEdit(values)}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ListItem;
