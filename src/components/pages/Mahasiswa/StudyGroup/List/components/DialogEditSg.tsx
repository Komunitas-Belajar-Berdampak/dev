import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { studyGroupQuickEditSchema, type StudyGroupQuickEditSchemaType } from '@/schemas/sg';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type DialogEditSgProps = {
  defaultValues?: Partial<StudyGroupQuickEditSchemaType>;
  onSave?: (values: StudyGroupQuickEditSchemaType) => void;
  isPending?: boolean;
};

const DialogEditSg = ({ defaultValues, onSave, isPending = false }: DialogEditSgProps) => {
  const form = useForm<StudyGroupQuickEditSchemaType>({
    resolver: zodResolver(studyGroupQuickEditSchema),
    defaultValues: {
      nama: defaultValues?.nama ?? '',
      deskripsi: defaultValues?.deskripsi ?? '',
    },
  });

  useEffect(() => {
    form.reset({
      nama: defaultValues?.nama ?? '',
      deskripsi: defaultValues?.deskripsi ?? '',
    });
  }, [defaultValues?.deskripsi, defaultValues?.nama, form]);

  const submit = (values: StudyGroupQuickEditSchemaType) => {
    onSave?.(values);
  };

  return (
    <div className='space-y-4'>
      <DialogHeader className='gap-1'>
        <DialogTitle className='text-primary text-lg font-bold'>Edit Study Group</DialogTitle>
        <DialogDescription className='text-sm text-black/40'>Silahkan edit study group</DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(submit)}>
        <FieldSet>
          <FieldGroup>
            <Controller
              name='nama'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className='text-gray-500'>
                    Nama Study Group*
                  </FieldLabel>
                  <Input {...field} id={field.name} aria-invalid={fieldState.invalid} type='text' placeholder='Masukkan nama study group' className='text-xs md:text-sm text-black' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs' />}
                </Field>
              )}
            />

            <Controller
              name='deskripsi'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name} className='text-gray-500'>
                    Deskripsi (optional)
                  </FieldLabel>
                  <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder='Masukkan deskripsi study group' className='text-xs md:text-sm text-black border' />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} className='text-xs ' />}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className='space-x-2 '>
            <Button type='submit' variant='default' className='shadow-sm border px-5' disabled={isPending}>
              Save
            </Button>
            <DialogClose asChild>
              <Button type='button' variant='secondary' className='shadow-sm border bg-accent hover:opacity-85'>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </FieldSet>
      </form>
    </div>
  );
};

export default DialogEditSg;
