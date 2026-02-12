import { getAssignmentsByCourse } from '@/api/assignment';
import { createThreadByStudyGroup } from '@/api/thread-post';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { threadSchema, type ThreadSchemaType } from '@/schemas/thread';
import type { ApiResponse } from '@/types/api';
import type { Assignment } from '@/types/assignment';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

type DialogAddThreadProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idSg: string;
  idCourse: string;
};

const DialogAddThread = ({ open, onOpenChange, idSg, idCourse }: DialogAddThreadProps) => {
  const queryClient = useQueryClient();

  const form = useForm<ThreadSchemaType>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      judul: '',
      idAssignment: '',
    },
  });

  const {
    data: assignments,
    isLoading: isAssignmentsLoading,
    isError: isAssignmentsError,
    error: assignmentsError,
  } = useQuery<ApiResponse<Assignment[]>, Error, Assignment[]>({
    queryKey: ['assignments-by-course', idCourse],
    queryFn: () => getAssignmentsByCourse(idCourse),
    select: (res) => res.data,
    enabled: open,
  });

  useEffect(() => {
    if (!isAssignmentsError) return;
    toast.error(assignmentsError?.message || 'Gagal mengambil daftar assignment.', { toasterId: 'global' });
  }, [assignmentsError?.message, isAssignmentsError]);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ThreadSchemaType) => createThreadByStudyGroup(idSg, { judul: values.judul, assignmentId: values.idAssignment }),
    onSuccess: async (res) => {
      toast.success(res.message || 'Berhasil menambahkan topik.', { toasterId: 'global' });
      await queryClient.invalidateQueries({ queryKey: ['threads-by-sg', idSg] });
      form.reset({ judul: '', idAssignment: '' });
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menambahkan topik.', { toasterId: 'global' });
    },
  });

  useEffect(() => {
    if (open) return;
    form.reset({ judul: '', idAssignment: '' });
  }, [form, open]);

  const submit = (values: ThreadSchemaType) => {
    mutate(values);
  };

  const hasAssignments = (assignments?.length ?? 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg rounded-xl'>
        <div className='space-y-4'>
          <DialogHeader className='gap-1'>
            <DialogTitle className='text-primary text-lg font-bold'>New Topic</DialogTitle>
            <DialogDescription className='text-xs text-black/40'>Silahkan buat topik pembahasan baru</DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(submit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name='judul'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Judul*
                      </FieldLabel>
                      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan judul topik' className='text-xs md:text-sm text-black' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />

                <Controller
                  name='idAssignment'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Assignment*
                      </FieldLabel>
                      <Select value={field.value || undefined} onValueChange={field.onChange} disabled={isAssignmentsLoading || !hasAssignments}>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder={isAssignmentsLoading ? 'Loading assignment...' : hasAssignments ? 'Pilih assignment' : 'Tidak ada assignment'} />
                        </SelectTrigger>
                        <SelectContent>
                          {hasAssignments ? (
                            assignments?.map((a) => (
                              <SelectItem key={a.id} value={a.id}>
                                Pertemuan {a.pertemuan} - {a.judul}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value='__empty' disabled>
                              Tidak ada assignment
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />
              </FieldGroup>

              <DialogFooter className='space-x-2'>
                <Button type='submit' variant='default' className='shadow-sm border px-5' disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create'}
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='secondary' className='shadow-sm border bg-accent hover:opacity-85' disabled={isPending}>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </FieldSet>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogAddThread;
