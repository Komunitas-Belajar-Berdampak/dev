import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/types/task';

type TaskDetailDialogProps = {
  open: boolean;
  task: Task | null;
  getStatusLabel: (value: Task['status']) => string;
  onOpenChange: (open: boolean) => void;
};

function TaskDetailDialog({ open, task, getStatusLabel, onOpenChange }: TaskDetailDialogProps) {
  const members = task?.mahasiswa?.map((m) => m.nama).filter(Boolean) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg rounded-xl'>
        <div className='space-y-4'>
          <DialogHeader className='gap-1'>
            <DialogTitle className='text-primary text-lg font-bold'>{task?.task || '-'}</DialogTitle>
            <DialogDescription className='text-xs text-black/40'>Detail task (readonly)</DialogDescription>
          </DialogHeader>

          <div className='space-y-3'>
            <div className='space-y-1'>
              <p className='text-xs text-black/40'>Members</p>
              <div className='flex flex-wrap gap-2'>
                {members.length > 0 ? (
                  members.map((member) => (
                    <Badge variant='default' key={member}>
                      {member}
                    </Badge>
                  ))
                ) : (
                  <Badge variant='outline'>-</Badge>
                )}
              </div>
            </div>

            <div className='space-y-1'>
              <p className='text-xs text-black/40'>Status</p>
              <Badge variant='outline'>{task ? getStatusLabel(task.status) : '-'}</Badge>
            </div>

            <div className='space-y-1'>
              <p className='text-xs text-black/40'>Description</p>
              <Textarea value={task?.deskripsi ?? ''} placeholder='Tidak ada deskripsi task.' className='text-xs text-black border min-h-28' readOnly disabled={!task} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetailDialog;
