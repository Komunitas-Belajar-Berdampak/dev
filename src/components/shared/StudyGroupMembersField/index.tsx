import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue, useComboboxAnchor } from '@/components/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { toast } from 'sonner';

type StudyGroupMembersFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  items: string[];
  namaById: Map<string, string>;
  kapasitas: number;
  isLoading?: boolean;
  label?: string;
};

export function StudyGroupMembersField<TFieldValues extends FieldValues>({ control, name, items, namaById, kapasitas, isLoading, label = 'Masukkan Anggota (Optional)' }: StudyGroupMembersFieldProps<TFieldValues>) {
  const anchor = useComboboxAnchor();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className='mt-4 ml-4 w-full'>
          <FieldLabel htmlFor={field.name} className='text-gray-500'>
            {label}
          </FieldLabel>

          <Combobox
            multiple
            autoHighlight
            items={[...new Set([...(items ?? []), ...(((field.value as string[]) ?? []) as string[])])]}
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
                {isLoading ? (
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
  );
}
