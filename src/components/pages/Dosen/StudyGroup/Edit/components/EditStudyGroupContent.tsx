import { getCourseById } from '@/api/course';
import { editStudyGroupById, getStudyGroupById } from '@/api/study-group';
import { StudyGroupMembersField } from '@/components/shared/StudyGroupMembersField';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSgMemberCapacityLimit } from '@/hooks/use-sg-member-capacity';
import { studyGroupSchema, type StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { CourseById } from '@/types/course';
import type { StudyGroupDetail } from '@/types/sg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type EditStudyGroupContentProps = {
  idMatkul: string;
  namaMatkul: string;
  idSg: string;
  namaSg: string;
};

const EditStudyGroupContent = ({ idMatkul, idSg }: EditStudyGroupContentProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ambil data mata kuliah buat dapet si mahasisa yang ngambil matkul itu
  const { data: courseData, isLoading: isLoadingCourse } = useQuery<ApiResponse<CourseById>>({
    queryKey: ['course-by-id', idMatkul],
    queryFn: () => getCourseById(idMatkul),
    enabled: Boolean(idMatkul),
  });
  const mahasiswaCourse = courseData?.data.mahasiswa;

  // ambil data study group detail
  const { data: studyGroupData } = useQuery<ApiResponse<StudyGroupDetail>>({
    queryKey: ['sg-detail', idSg],
    queryFn: () => getStudyGroupById(idSg),
    enabled: Boolean(idSg),
  });

  const studygroup = studyGroupData?.data;
  const anggota = studygroup?.anggota;

  const anggotaId = useMemo(() => {
    if (!anggota) return [];
    return anggota.map((a) => a.id);
  }, [anggota]);

  // filter mahasiswa yang udah jadi member biar gak ditampilin di add member
  const mahasiswaAvailable = useMemo(() => {
    if (!mahasiswaCourse) return [];
    if (!anggotaId.length) return mahasiswaCourse;

    const anggotaSet = new Set(anggotaId);
    return mahasiswaCourse.filter((m) => !anggotaSet.has(m.id));
  }, [mahasiswaCourse, anggotaId]);
  const idItems = useMemo(() => mahasiswaAvailable.map((m) => m.id) ?? [], [mahasiswaAvailable]);
  const namaById = useMemo(() => new Map((mahasiswaCourse ?? []).map((m) => [m.id, m.nama])), [mahasiswaCourse]);

  // kirim data ke
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: StudyGroupSchemaType) => editStudyGroupById(idSg, payload),
    onSuccess: async () => {
      toast.success('Study Group berhasil diedit', { toasterId: 'global' });
      form.reset();

      await Promise.all([queryClient.invalidateQueries({ queryKey: ['sg-by-course', idMatkul] }), queryClient.invalidateQueries({ queryKey: ['sg-detail', idSg] })]);

      navigate(-1);
    },
    onError: () => {
      toast.error('Gagal mengedit Study Group', { toasterId: 'global' });
    },
  });

  // form handling
  const form = useForm<StudyGroupSchemaType>({
    resolver: zodResolver(studyGroupSchema),
    defaultValues: {
      nama: '',
      kapasitas: 1,
      deskripsi: '',
      status: false,
      idMahasiswa: [],
    },
  });

  const { kapasitas } = useSgMemberCapacityLimit({
    form,
    kapasitasName: 'kapasitas',
    membersName: 'idMahasiswa',
  });

  useEffect(() => {
    if (!studygroup) return;
    form.reset({
      nama: studygroup.nama ?? '',
      kapasitas: studygroup.kapasitas ?? 1,
      deskripsi: studygroup.deskripsi ?? '',
      status: studygroup.status ?? false,
      idMahasiswa: studygroup.anggota?.map((a) => a.id) ?? [],
    });
  }, [studygroup, form]);

  const onSubmit = (data: StudyGroupSchemaType) => {
    mutate(data);
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldSet>
          <FieldGroup>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row justify-between gap-4'>
                <Controller
                  name='nama'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Nama Study Group*
                      </FieldLabel>
                      <Input {...field} value={field.value} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan nama study group anda' className='text-xs md:text-sm text-black' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />

                <Controller
                  name='kapasitas'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='ml-4'>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Kapasitas Maksimal Anggota*
                      </FieldLabel>
                      <Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder='Pilih kapasitas' />
                        </SelectTrigger>
                        <SelectContent>
                          {[...Array(10)].map((_, index) => (
                            <SelectItem key={index + 1} value={(index + 1).toString()}>
                              {index + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />
              </div>

              <div className='flex flex-row gap-4'>
                <Controller
                  name='deskripsi'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='mt-4 w-full'>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Deskripsi (optional)
                      </FieldLabel>
                      <Input {...field} value={field.value} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan deskripsi study group anda' className='text-xs md:text-sm text-black' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />

                <StudyGroupMembersField control={form.control} name='idMahasiswa' items={idItems} namaById={namaById} kapasitas={kapasitas} isLoading={isLoadingCourse} />
              </div>

              <Controller
                name='status'
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className='mt-4' orientation={'horizontal'}>
                    <Checkbox id={field.name} name={field.name} checked={Boolean(field.value)} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                    <FieldLabel htmlFor={field.name} className='text-gray-500'>
                      Permintaan Bergabung (Mahasiswa request join untuk bergabung ke study group)
                    </FieldLabel>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <Field orientation={'horizontal'} className='flex w-full justify-end gap-4'>
            <Button type='submit' size={'lg'} className='mt-6 shadow-sm px-8'>
              {isPending ? 'Editing...' : 'Save'}
            </Button>

            <Button variant={'secondary'} size={'lg'} type='button' className='mt-6 shadow-sm border bg-accent hover:opacity-85' onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </Field>
        </FieldSet>
      </form>
    </div>
  );
};

export default EditStudyGroupContent;
