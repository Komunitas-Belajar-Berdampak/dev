import { useEffect } from 'react';
import { type FieldPathByValue, type FieldValues, type PathValue, type UseFormReturn, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

const EMPTY_MEMBERS: readonly unknown[] = [];

type UseSgMemberCapacityOptions<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  kapasitasName: FieldPathByValue<TFieldValues, number>;
  membersName: FieldPathByValue<TFieldValues, unknown[] | undefined>;
  toastOnTrim?: boolean;
  toasterId?: string;
};

export function useSgMemberCapacityLimit<TFieldValues extends FieldValues>({ form, kapasitasName, membersName, toastOnTrim = true, toasterId = 'global' }: UseSgMemberCapacityOptions<TFieldValues>) {
  const watchedKapasitas = useWatch({ control: form.control, name: kapasitasName });
  const watchedSelected = useWatch({ control: form.control, name: membersName });

  const kapasitas = typeof watchedKapasitas === 'number' && Number.isFinite(watchedKapasitas) && watchedKapasitas > 0 ? watchedKapasitas : 1;
  const selected = Array.isArray(watchedSelected) ? watchedSelected : EMPTY_MEMBERS;

  useEffect(() => {
    if (selected.length <= kapasitas) return;

    const trimmed = selected.slice(0, kapasitas);
    form.setValue(membersName, trimmed as PathValue<TFieldValues, typeof membersName>, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (toastOnTrim) {
      toast.error(`Maksimal anggota sesuai kapasitas (${kapasitas}).`, { toasterId });
    }
  }, [form, kapasitas, membersName, selected, toastOnTrim, toasterId]);

  return { kapasitas, selected };
}
