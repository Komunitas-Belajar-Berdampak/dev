import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import type { Task } from '@/types/task';

type DescriptionSaveState = 'idle' | 'saving' | 'saved' | 'error';

type TaskDetailDialogProps = {
  open: boolean;
  task: Task | null;
  description: string;
  saveState: DescriptionSaveState;
  saveDisabled: boolean;
  getStatusLabel: (value: Task['status']) => string;
  onDescriptionChange: (next: string) => void;
  onSave: () => void;
  onOpenChange: (open: boolean) => void;
};

function TaskDetailDialog({ open, task, description, saveState, saveDisabled, getStatusLabel, onDescriptionChange, onSave, onOpenChange }: TaskDetailDialogProps) {
  const members = task?.mahasiswa?.map((m) => m.nama).filter(Boolean) ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg rounded-xl'>
        <div className='space-y-4'>
          <DialogHeader className='gap-1'>
            <DialogTitle className='text-primary text-lg font-bold'>{task?.task || '-'}</DialogTitle>
            <DialogDescription className='text-sm text-black/40'>Detail task dan deskripsi to do</DialogDescription>
          </DialogHeader>

          <div className='space-y-3'>
            <div className='space-y-1'>
              <p className='text-sm text-black/40'>Members</p>
              <div className='flex flex-wrap gap-2'>{members.length > 0 ? members.map((member) => <Badge key={member}>{member}</Badge>) : <Badge variant={'outline'}>-</Badge>}</div>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-black/40'>Status</p>
              <Badge variant={'outline'}>{task ? getStatusLabel(task.status) : '-'}</Badge>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-black/40'>Description</p>
              <Textarea value={description} onChange={(event) => onDescriptionChange(event.target.value)} placeholder='Tulis deskripsi task...' className='text-sm text-black border min-h-28' disabled={!task} />

              <div className='flex justify-end mt-4'>
                <Button type='button' size='sm' onClick={onSave} disabled={saveDisabled} className='text-sm'>
                  {saveState === 'saving' ? 'Menyimpan...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default TaskDetailDialog;
