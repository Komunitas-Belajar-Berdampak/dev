import { addTask, deleteTask, updateTask } from '@/api/task';
import type { TaskSchemaType } from '@/schemas/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useTodoTaskMutations(threadId: string, opts?: { onAddSuccess?: () => void; onUpdateSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const invalidateTasks = async () => {
    await queryClient.invalidateQueries({ queryKey: ['tasks', threadId] });
  };

  const addMutation = useMutation({
    mutationFn: (payload: TaskSchemaType) => addTask(threadId, payload),
    onSuccess: async (res) => {
      toast.success(res.message || 'Berhasil menambahkan To Do.', { toasterId: 'global' });
      await invalidateTasks();
      opts?.onAddSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menambahkan To Do.', { toasterId: 'global' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: TaskSchemaType }) => updateTask(taskId, payload),
    onSuccess: async (res) => {
      toast.success(res.message || 'Berhasil mengubah To Do.', { toasterId: 'global' });
      await invalidateTasks();
      opts?.onUpdateSuccess?.();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal mengubah To Do.', { toasterId: 'global' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: async (res) => {
      toast.success(res.message || 'Berhasil menghapus To Do.', { toasterId: 'global' });
      await invalidateTasks();
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Gagal menghapus To Do.', { toasterId: 'global' });
    },
  });

  const isPending = addMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return {
    addMutation,
    updateMutation,
    deleteMutation,
    isPending,
  };
}
