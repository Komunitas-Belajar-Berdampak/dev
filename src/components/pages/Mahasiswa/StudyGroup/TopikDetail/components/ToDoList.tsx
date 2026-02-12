import ToDoListSkeleton from '@/components/pages/Dosen/StudyGroup/TopikDetail/components/ToDoListSkeleton';
import type { TaskFilterValue } from '@/components/shared/Filter/TaskFilterDropdown';
import NoData from '@/components/shared/NoData';
import { TableCell, TableRow } from '@/components/ui/table';
import { taskSchema, type TaskSchemaType } from '@/schemas/task';
import type { AnggotaStudyGroup } from '@/types/sg';
import type { Task } from '@/types/task';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getTaskStatusLabel, tableHeaders, TASK_FILTER_ALL, TASK_STATUS_OPTIONS } from '../constant';
import { useTodoTaskMutations } from '../libs/useTodoTaskMutations';
import TodoListFooter from './TodoListFooter';
import TodoListTable from './TodoListTable';
import TodoRowDisplay from './TodoRowDisplay';
import TodoRowForm from './TodoRowForm';

type ToDoListContentProps = {
  threadId: string;
  members: AnggotaStudyGroup[];
  filters: TaskFilterValue;
  tasksQuery: {
    data: Task[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
  };
};

const ToDoListContent = ({ threadId, members, filters, tasksQuery }: ToDoListContentProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addForm = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      task: '',
      idMahasiswa: [],
      status: 'DO',
    },
  });

  const editForm = useForm<TaskSchemaType>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      task: '',
      idMahasiswa: [],
      status: 'DO',
    },
  });

  useEffect(() => {
    if (!tasksQuery.isError) return;
    toast.error(tasksQuery.error?.message || 'Gagal mengambil data To Do List.', { toasterId: 'global' });
  }, [tasksQuery.error?.message, tasksQuery.isError]);

  useEffect(() => {
    setIsAdding(false);
    setEditingId(null);
  }, [filters.memberId, filters.status]);

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

  const { addMutation, updateMutation, deleteMutation, isPending } = useTodoTaskMutations(threadId, {
    onAddSuccess: () => {
      addForm.reset({ task: '', idMahasiswa: [], status: 'DO' });
      setIsAdding(false);
    },
    onUpdateSuccess: () => {
      setEditingId(null);
    },
  });

  const startEdit = (task: Task) => {
    setIsAdding(false);
    setEditingId(task.id);
    editForm.reset({
      task: task.task ?? '',
      idMahasiswa: task.mahasiswa?.map((m) => m.id) ?? [],
      status: task.status ?? 'DO',
    });
  };

  const stopEdit = () => {
    setEditingId(null);
    editForm.reset({ task: '', idMahasiswa: [], status: 'DO' });
  };

  const stopAdd = () => {
    setIsAdding(false);
    addForm.reset({ task: '', idMahasiswa: [], status: 'DO' });
  };

  if (tasksQuery.isLoading) return <ToDoListSkeleton />;

  const disableActions = isPending;

  return (
    <TodoListTable
      headers={tableHeaders}
      footer={
        <TodoListFooter
          disabled={disableActions}
          onNew={() => {
            if (editingId) setEditingId(null);
            setIsAdding(true);
          }}
        />
      }
    >
      {isAdding && <TodoRowForm form={addForm} members={members} disabled={disableActions} statusOptions={TASK_STATUS_OPTIONS} onSubmit={(values) => addMutation.mutate(values)} onCancel={stopAdd} />}

      {tasksView.length === 0 && !isAdding ? (
        <TableRow>
          <TableCell colSpan={4} className='text-center text-accent py-10'>
            <NoData message={'Belum ada rencana to do yang dibuat'} />
          </TableCell>
        </TableRow>
      ) : (
        tasksView.map((task) => {
          const isEditing = editingId === task.id;

          if (isEditing) {
            return (
              <TodoRowForm
                key={task.id}
                form={editForm}
                members={members}
                disabled={disableActions}
                statusOptions={TASK_STATUS_OPTIONS}
                onSubmit={(values) => updateMutation.mutate({ taskId: task.id, payload: values })}
                onCancel={stopEdit}
              />
            );
          }

          return <TodoRowDisplay key={task.id} task={task} disabled={disableActions} getStatusLabel={getTaskStatusLabel} onEdit={startEdit} onDelete={(taskId) => deleteMutation.mutate(taskId)} />;
        })
      )}
    </TodoListTable>
  );
};

export default ToDoListContent;
