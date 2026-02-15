import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import type { StudyGroupSchemaType } from '@/schemas/sg';
import { Controller, useWatch, type Control } from 'react-hook-form';
import { toast } from 'sonner';

type EditStudyGroupMembersFieldProps = {
  control: Control<StudyGroupSchemaType>;
  allMahasiswaIds: string[];
  namaById: Map<string, string>;
};

const EditStudyGroupMembersField = ({ control, allMahasiswaIds, namaById }: EditStudyGroupMembersFieldProps) => {
  const anchor = useComboboxAnchor();

  // Baca kapasitas langsung dari form supaya selalu sinkron
  const kapasitas = useWatch({ control, name: 'kapasitas' }) ?? 1;

  return (
    <Controller
      name='idMahasiswa'
      control={control}
      render={({ field, fieldState }) => {
        const selected: string[] = (field.value as string[]) ?? [];

        // Gabung semua ID (course + yang sudah dipilih) supaya chips selalu bisa resolve
        const comboboxItems = [...new Set([...allMahasiswaIds, ...selected])];

        return (
          <Field data-invalid={fieldState.invalid} className='mt-4 ml-4 w-full'>
            <FieldLabel htmlFor={field.name} className='text-gray-500'>
              Masukkan Anggota (Optional)
            </FieldLabel>

            <Combobox
              multiple
              autoHighlight
              items={comboboxItems}
              value={selected}
              onValueChange={(nextValue) => {
                if (nextValue == null) {
                  field.onChange([]);
                  return;
                }

                const current = selected.filter(Boolean);

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
              <ComboboxChips ref={anchor} className='w-full'>
                <ComboboxValue>
                  {(values) => (
                    <>
                      {(values as string[]).map((id: string) => (
                        <ComboboxChip key={id}>{namaById.get(id) ?? id}</ComboboxChip>
                      ))}
                      <ComboboxChipsInput />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxContent anchor={anchor}>
                <ComboboxEmpty>Tidak ada mahasiswa ditemukan.</ComboboxEmpty>
                <ComboboxList>
                  {(id) => (
                    <ComboboxItem key={id} value={id}>
                      {namaById.get(id) ?? id}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
          </Field>
        );
      }}
    />
  );
};

export default EditStudyGroupMembersField;
