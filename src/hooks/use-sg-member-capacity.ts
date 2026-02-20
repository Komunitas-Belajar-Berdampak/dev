import { useEffect } from 'react';
import { type FieldPath, type FieldValues, type UseFormReturn, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

type UseSgMemberCapacityOptions<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  kapasitasName: FieldPath<TFieldValues>;
  membersName: FieldPath<TFieldValues>;
  toastOnTrim?: boolean;
  toasterId?: string;
};

export function useSgMemberCapacityLimit<TFieldValues extends FieldValues>({ form, kapasitasName, membersName, toastOnTrim = true, toasterId = 'global' }: UseSgMemberCapacityOptions<TFieldValues>) {
  const kapasitas = (useWatch({ control: form.control, name: kapasitasName }) as unknown as number) ?? 1;
  const selected = (useWatch({ control: form.control, name: membersName }) as unknown as unknown[]) ?? [];

  useEffect(() => {
    if (!Array.isArray(selected)) return;
    if (selected.length <= kapasitas) return;

    const trimmed = selected.slice(0, kapasitas);
    form.setValue(membersName, trimmed as any, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (toastOnTrim) {
      toast.error(`Maksimal anggota sesuai kapasitas (${kapasitas}).`, { toasterId });
    }
  }, [form, kapasitas, membersName, selected, toastOnTrim, toasterId]);

  return { kapasitas, selected };
}
