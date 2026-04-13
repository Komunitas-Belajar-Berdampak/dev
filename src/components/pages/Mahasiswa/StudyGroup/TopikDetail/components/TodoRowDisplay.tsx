import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Task } from '@/types/task';
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

type TodoRowDisplayProps = {
  task: Task;
  disabled?: boolean;
  getStatusLabel: (value: Task['status']) => string;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

function TodoRowDisplay({ task, disabled = false, getStatusLabel, onView, onEdit, onDelete }: TodoRowDisplayProps) {
  return (
    <TableRow>
      <TableCell className='font-medium text-black/50 whitespace-normal  text-xs md:text-sm'>{task.task}</TableCell>
      <TableCell className='align-top min-w-0'>
        <span className='block whitespace-normal wrap-break-word text-black/50 text-xs md:text-sm'>
          {task.mahasiswa.length === 0
            ? '-'
            : task.mahasiswa
                .map((m) => m.nama)
                .filter(Boolean)
                .join(', ')}
        </span>
      </TableCell>
      <TableCell className='text-black/50'>
        <span className='text-black/50  text-xs md:text-sm'>{getStatusLabel(task.status)}</span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type='button' variant='ghost' size='icon-sm' disabled={disabled} aria-label='Task actions'>
              <MoreHorizontal className='size-4 text-black/50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-44'>
            <DropdownMenuItem disabled={disabled} onSelect={() => onView(task)}>
              <Eye className='size-4 text-black/50' />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem disabled={disabled} onSelect={() => onEdit(task)}>
              <Pencil className='size-4 text-black/50' />
              Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem disabled={disabled} variant='destructive' onSelect={() => onDelete(task.id)}>
              <Trash2 className='size-4' />
              Hapus Task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default TodoRowDisplay;
