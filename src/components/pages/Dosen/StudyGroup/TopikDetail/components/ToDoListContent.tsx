import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import NoData from '@/components/shared/NoData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Task } from '@/types/task';
import { useMemo } from 'react';
import { getTaskStatusLabel, tableHeaders, TASK_FILTER_ALL } from '../constant';
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

  if (tasksQuery.isLoading) return <ToDoListSkeleton />;
  if (tasksQuery.isError) return <NoData message={tasksQuery.error?.message || 'Gagal mengambil task.'} />;

  return (
    <div className='mt-6 w-full rounded-xl border border-accent  shadow-sm overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow>
            {tableHeaders.map((header) => (
              <TableHead key={header} className='text-primary w-screen font-semibold'>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasksView.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className='text-center text-accent py-10'>
                Tidak ada task yang sesuai.
              </TableCell>
            </TableRow>
          ) : (
            tasksView.map((task) => {
              return (
                <TableRow key={task.id}>
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
                    <span className='text-black/50 text-sm'>{getTaskStatusLabel(task.status)}</span>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToDoListContent;
