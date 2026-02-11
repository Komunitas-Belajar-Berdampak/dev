import { Button } from '@/components/ui/button';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type DialogRequestProps = {
  studyGroupName?: string;
  onRequest?: () => void;
  isPending?: boolean;
};

const DialogRequest = ({ studyGroupName, onRequest, isPending = false }: DialogRequestProps) => {
  return (
    <div className='space-y-4'>
      <DialogHeader className='gap-1'>
        <DialogTitle className='text-primary text-sm font-bold'>Request Join ({studyGroupName || '-'})</DialogTitle>
        <DialogDescription className='text-xs text-black/40'>Apakah kamu yakin ingin mengirimkan permintaan masuk? </DialogDescription>
      </DialogHeader>

      <DialogFooter className='space-x-2 pt-4'>
        <Button variant='default' className='shadow-sm border px-5' onClick={onRequest} disabled={isPending}>
          Request Join
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

export default DialogRequest;
