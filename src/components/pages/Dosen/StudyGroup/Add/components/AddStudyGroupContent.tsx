import { getCourseById } from '@/api/course';
import { addStudyGroupByCourse } from '@/api/study-group';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studyGroupSchema, type StudyGroupSchemaType } from '@/schemas/sg';
import type { ApiResponse } from '@/types/api';
import type { CourseById } from '@/types/course';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AddStudyGroupContentProps = {
  idMatkul: string;
  namaMatkul: string;
};

const AddStudyGroupContent = ({ idMatkul }: AddStudyGroupContentProps) => {
  const navigate = useNavigate();
  const anchor = useComboboxAnchor();

  // ambil data mata kuliah buat dapet si mahasiswa yang ngmbil matkul itu
  const { data, isLoading } = useQuery<ApiResponse<CourseById>>({
    queryKey: ['courseById', idMatkul],
    queryFn: () => getCourseById(idMatkul),
  });

  const mahasiswaCourse = data?.data.mahasiswa;

  const nrpItems = useMemo(() => mahasiswaCourse?.map((m) => m.nrp) ?? [], [mahasiswaCourse]);
  const namaByNrp = useMemo(() => new Map(mahasiswaCourse?.map((m) => [m.nrp, m.nama])), [mahasiswaCourse]);

  // kirim data ke api
  const { mutate, isPending } = useMutation({
    mutationFn: (payload: StudyGroupSchemaType) => addStudyGroupByCourse(idMatkul, payload),
    onSuccess: () => {
      toast.success('Study Group berhasil ditambahkan', { toasterId: 'global' });
      form.reset();

      navigate(-1);
    },
    onError: () => {
      toast.error('Gagal menambahkan Study Group', { toasterId: 'global' });
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
      anggota: [],
    },
  });

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
                      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan nama study group anda' className='text-xs md:text-sm text-black' />
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
                      <Select onValueChange={(v) => field.onChange(Number(v))}>
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
                      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan deskripsi study group anda' className='text-xs md:text-sm text-black' />
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                    </Field>
                  )}
                />

                <Controller
                  name='anggota'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className='mt-4 ml-4 w-full'>
                      <FieldLabel htmlFor={field.name} className='text-gray-500'>
                        Masukkan Anggota (Optional)
                      </FieldLabel>

                      <Combobox multiple autoHighlight items={nrpItems} onValueChange={field.onChange}>
                        <ComboboxChips ref={anchor} className={'w-full'}>
                          <ComboboxValue>
                            {(values) => (
                              <>
                                {values.map((nrp: string) => (
                                  <ComboboxChip key={`${nrp}`}>{namaByNrp.get(nrp)}</ComboboxChip>
                                ))}

                                <ComboboxChipsInput />
                              </>
                            )}
                          </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={anchor}>
                          <ComboboxEmpty>No items found.</ComboboxEmpty>
                          <ComboboxList>
                            {isLoading ? (
                              <p>Loading...</p>
                            ) : (
                              (nrp) => (
                                <ComboboxItem key={nrp} value={nrp}>
                                  {namaByNrp.get(nrp)}
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
                    <Checkbox id={field.name} name={field.name} checked={field.value} onCheckedChange={field.onChange} />
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
            <Button type='submit' size={'lg'} className='mt-6 shadow-sm'>
              {isPending ? 'Adding...' : 'Add Study Group'}
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
export default AddStudyGroupContent;
