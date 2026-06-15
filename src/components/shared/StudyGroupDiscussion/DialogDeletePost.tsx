import { deletePost } from '@/api/thread-post';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

type DialogDeletePostProps = {
  postId: string;
  onClose?: () => void;
};

const DialogDeletePost = ({ postId, onClose }: DialogDeletePostProps) => {
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

  return (
    <div className='space-y-4'>
      <DialogHeader>
        <DialogTitle className='text-sm font-bold text-primary'>Hapus Discussion</DialogTitle>
      </DialogHeader>

      <p className='text-sm text-primary'>Apakah Anda yakin ingin menghapus discussion ini? karena tidak dapat dikembalikan.</p>

      <DialogFooter className='space-x-2'>
        <Button variant='default' className='w-full border px-5 shadow-sm md:w-auto' onClick={() => mutate()} disabled={isPending}>
          Hapus
        </Button>
        <DialogClose asChild>
          <Button variant='secondary' className='w-full border bg-accent shadow-sm hover:opacity-85 md:w-auto'>
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
};

export default DialogDeletePost;
