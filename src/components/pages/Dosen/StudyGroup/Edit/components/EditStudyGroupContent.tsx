import { getCourseById } from '@/api/course';
import { editStudyGroupById, getStudyGroupById } from '@/api/study-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studyGroupSchema, type StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { CourseById } from '@/types/course';
import type { StudyGroupDetail } from '@/types/sg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
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
  const anchor = useComboboxAnchor();
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

  const kapasitas = useWatch({ control: form.control, name: 'kapasitas', defaultValue: 1 });
  const selectedMahasiswa = useWatch({ control: form.control, name: 'idMahasiswa', defaultValue: [] });

  useEffect(() => {
    if (!Array.isArray(selectedMahasiswa)) return;
    if (selectedMahasiswa.length <= kapasitas) return;

    form.setValue('idMahasiswa', selectedMahasiswa.slice(0, kapasitas), {
      shouldValidate: true,
      shouldDirty: true,
    });
    toast.error(`Maksimal anggota sesuai kapasitas (${kapasitas}).`, { toasterId: 'global' });
  }, [form, kapasitas, selectedMahasiswa]);

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

                <Controller
                  name='idMahasiswa'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='mt-4 ml-4 w-full'>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Masukkan Anggota (Optional)
                      </FieldLabel>

                      <Combobox
                        multiple
                        autoHighlight
                        items={[...new Set([...(idItems ?? []), ...((field.value as string[]) ?? [])])]}
                        value={(field.value as string[]) ?? []}
                        onValueChange={(nextValue) => {
                          if (nextValue == null) {
                            field.onChange([]);
                            return;
                          }

                          const current = ((field.value as string[]) ?? []).filter(Boolean);

                          if (Array.isArray(nextValue)) {
                            if (nextValue.length > kapasitas) {
                              toast.error(`Kapasitas cuma ${kapasitas}, jadi maksimal pilih ${kapasitas} anggota.`, { toasterId: 'global' });
                              return;
                            }
                            field.onChange(nextValue);
                            return;
                          }

                          const pickedId = String(nextValue);
                          if (current.includes(pickedId)) {
                            field.onChange(current.filter((v) => v !== pickedId));
                            return;
                          }

                          if (current.length + 1 > kapasitas) {
                            toast.error(`Kapasitas cuma ${kapasitas}, jadi maksimal pilih ${kapasitas} anggota.`, { toasterId: 'global' });
                            return;
                          }

                          field.onChange([...current, pickedId]);
                        }}
                      >
                        <ComboboxChips ref={anchor} className={'w-full'}>
                          <ComboboxValue>
                            {(values) => (
                              <>
                                {(values as string[]).map((id: string) => (
                                  <ComboboxChip key={`${id}`}>{namaById.get(id) ?? id}</ComboboxChip>
                                ))}

                                <ComboboxChipsInput />
                              </>
                            )}
                          </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {isLoadingCourse ? (
                              <p>Loading...</p>
                            ) : (
                              (id) => (
                                <ComboboxItem key={id} value={id}>
                                  {namaById.get(id) ?? id}
                                </ComboboxItem>
                              )
                            )}
                          </ComboboxList>
                        </ComboboxContent>
                      </Combobox>

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />
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
