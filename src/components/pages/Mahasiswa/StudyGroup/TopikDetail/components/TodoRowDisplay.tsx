import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Task } from '@/types/task';
import { Pencil, Trash2 } from 'lucide-react';

type TodoRowDisplayProps = {
  task: Task;
  disabled?: boolean;
  getStatusLabel: (value: Task['status']) => string;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

function TodoRowDisplay({ task, disabled = false, getStatusLabel, onEdit, onDelete }: TodoRowDisplayProps) {
  return (
    <TableRow>
      <TableCell className='font-medium text-black/50 whitespace-normal'>{task.task}</TableCell>
      <TableCell>
        <span className='text-black/50 text-sm'>
          {task.mahasiswa.length === 0
            ? '-'
            : task.mahasiswa
                .map((m) => m.nama)
                .filter(Boolean)
                .join(', ')}
        </span>
      </TableCell>
      <TableCell className='text-black/50'>
        <span className='text-black/50 text-sm'>{getStatusLabel(task.status)}</span>
      </TableCell>
      <TableCell>
        <div className='flex items-center gap-1'>
          <Button type='button' variant='ghost' size='icon-sm' disabled={disabled} onClick={() => onEdit(task)}>
            <Pencil className='size-4 text-black/50' />
          </Button>
          <Button type='button' variant='ghost' size='icon-sm' disabled={disabled} onClick={() => onDelete(task.id)}>
            <Trash2 className='size-4 text-black/50' />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default TodoRowDisplay;
