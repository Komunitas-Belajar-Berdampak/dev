import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import type { TaskSchemaType } from '@/schemas/task';
import type { AnggotaStudyGroup } from '@/types/sg';
import { Check, X } from 'lucide-react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import MembersMultiSelect from './MembersMultiSelect';

type TodoRowFormProps = {
  form: UseFormReturn<TaskSchemaType>;
  members: AnggotaStudyGroup[];
  disabled?: boolean;
  statusOptions: Array<{ label: string; value: TaskSchemaType['status'] }>;
  onSubmit: (values: TaskSchemaType) => void;
  onCancel: () => void;
};

function TodoRowForm({ form, members, disabled = false, statusOptions, onSubmit, onCancel }: TodoRowFormProps) {
  return (
    <TableRow>
      <TableCell className='align-top'>
        <Controller
          name='task'
          control={form.control}
          render={({ field, fieldState }) => (
            <div className='space-y-1'>
              <Input {...field} aria-invalid={fieldState.invalid} placeholder='Masukkan task' className='text-xs md:text-sm text-black' disabled={disabled} />
              {fieldState.invalid && <p className='text-xs text-destructive'>{fieldState.error?.message}</p>}
            </div>
          )}
        />
      </TableCell>

      <TableCell className='align-top'>
        <Controller
          name='idMahasiswa'
          control={form.control}
          render={({ field, fieldState }) => (
            <div className='space-y-1'>
              <MembersMultiSelect value={(field.value ?? []) as string[]} onChange={(v) => field.onChange(v)} members={members} disabled={disabled} />
              {fieldState.invalid && <p className='text-xs text-destructive'>{fieldState.error?.message}</p>}
            </div>
          )}
        />
      </TableCell>

      <TableCell className='align-top'>
        <Controller
          name='status'
          control={form.control}
          render={({ field, fieldState }) => (
            <div className='space-y-1'>
              <Select value={field.value} onValueChange={(v) => field.onChange(v as TaskSchemaType['status'])} disabled={disabled}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Pilih status' />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <p className='text-xs text-destructive'>{fieldState.error?.message}</p>}
            </div>
          )}
        />
      </TableCell>

      <TableCell className='align-top'>
        <div className='flex items-center gap-2'>
          <Button type='button' variant='ghost' size='icon-sm' disabled={disabled} onClick={form.handleSubmit(onSubmit)}>
            <Check className='size-4 text-primary' />
          </Button>
          <Button type='button' variant='ghost' size='icon-sm' disabled={disabled} onClick={onCancel}>
            <X className='size-4 text-black/50' />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default TodoRowForm;
