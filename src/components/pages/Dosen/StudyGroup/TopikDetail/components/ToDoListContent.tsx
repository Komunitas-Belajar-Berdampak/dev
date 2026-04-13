import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import NoData from '@/components/shared/NoData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Task } from '@/types/task';
import { Eye } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getTaskStatusLabel, tableHeaders, TASK_FILTER_ALL } from '../constant';
import TaskDetailDialog from './TaskDetailDialog';
import ToDoListSkeleton from './ToDoListSkeleton';

type ToDoListContentProps = {
  filters: TaskFilterValue;
  tasksQuery: {
    data: Task[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const ToDoListContent = ({ filters, tasksQuery }: ToDoListContentProps) => {
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  const tasksView = useMemo(() => {
    const memberId = filters.memberId;
    const status = filters.status;

    return tasksQuery.data.filter((t) => {
      const assignees = t.mahasiswa.map((m) => m.id);
      const currentStatus = t.status;

      if (memberId !== TASK_FILTER_ALL && !assignees.includes(memberId)) return false;
      if (status !== TASK_FILTER_ALL && currentStatus !== status) return false;
      return true;
    });
  }, [tasksQuery.data, filters.memberId, filters.status]);

  const selectedTask = useMemo(() => tasksQuery.data.find((task) => task.id === detailTaskId) ?? null, [tasksQuery.data, detailTaskId]);

  useEffect(() => {
    if (!tasksQuery.isError) return;

    toast.error(tasksQuery.error?.message || 'Gagal mengambil data To Do List.', { toasterId: 'global' });
  }, [tasksQuery.error?.message, tasksQuery.isError]);

  useEffect(() => {
    setDetailTaskId(null);
  }, [filters.memberId, filters.status]);

  if (tasksQuery.isLoading) return <ToDoListSkeleton />;

  return (
    <div className='mt-6 w-full rounded-xl border border-accent  shadow-sm overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableHead key={header} className='text-primary w-screen font-semibold  text-xs md:text-sm'>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasksView.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className='text-center text-accent py-10 '>
                <NoData message={'Belum ada rencana to do yang dibuat'} />
              </TableCell>
            </TableRow>
          ) : (
            tasksView.map((task) => {
              return (
                <TableRow key={task.id}>
                  <TableCell className='text-xs md:text-sm font-medium text-black/50 whitespace-normal'>{task.task}</TableCell>
                  <TableCell>
                    <span className='text-black/50 text-xs md:text-sm'>
                      {task.mahasiswa.length === 0
                        ? '-'
                        : task.mahasiswa
                            .map((m) => m.nama)
                            .filter(Boolean)
                            .join(', ')}
                    </span>
                  </TableCell>
                  <TableCell className='text-black/50'>
                    <span className='text-black/50  text-xs md:text-sm'>{getTaskStatusLabel(task.status)}</span>
                  </TableCell>
                  <TableCell>
                    <Button type='button' variant='ghost' size='icon-sm' onClick={() => setDetailTaskId(task.id)} aria-label='Lihat detail task'>
                      <Eye className='size-4 text-black/50' />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <TaskDetailDialog
        open={Boolean(detailTaskId)}
        task={selectedTask}
        getStatusLabel={getTaskStatusLabel}
        onOpenChange={(open) => {
          if (!open) setDetailTaskId(null);
        }}
      />
    </div>
  );
};

export default ToDoListContent;
