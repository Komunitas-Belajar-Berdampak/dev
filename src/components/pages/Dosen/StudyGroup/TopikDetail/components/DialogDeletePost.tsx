import { deletePost } from '@/api/thread-post';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const DialogDeletePost = ({ postId, onClose }: { postId: string; onClose?: () => void }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success('Discussion berhasil dihapus!', { toasterId: 'global' });
      queryClient.invalidateQueries({ queryKey: ['threads-by-id'] });
      onClose?.();
    },
    onError: () => {
      toast.error('Gagal menghapus discussion!', { toasterId: 'global' });
    },
  });

  const onDelete = () => {
    mutate();
  };

  return (
    <div className='space-y-4'>
      <DialogHeader>
        <DialogTitle className='text-primary text-sm font-bold'>Hapus Discussion</DialogTitle>
      </DialogHeader>

      <p className='text-sm text-primary'>Apakah Anda yakin ingin menghapus discussion ini? karena tidak dapat dikembalikan.</p>

      <DialogFooter className='space-x-2'>
        <Button variant='default' className='shadow-sm border px-5' onClick={onDelete} disabled={isPending}>
          Hapus
        </Button>
        <DialogClose asChild>
          <Button variant='secondary' className='shadow-sm border bg-accent hover:opacity-85'>
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default DialogDeletePost;
