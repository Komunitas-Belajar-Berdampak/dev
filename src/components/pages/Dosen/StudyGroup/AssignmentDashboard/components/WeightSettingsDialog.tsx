import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { StudyGroupAssignmentDashboardAssignment, StudyGroupAssignmentWeight } from '@/types/sg';
import { formatAssignmentLabel, formatScore } from '../utils/formatters';

type WeightSettingsDialogProps = {
  open: boolean;
  enabled: boolean;
  draftEnabled: boolean;
  assignments: StudyGroupAssignmentDashboardAssignment[];
  draftWeights: StudyGroupAssignmentWeight[];
  onOpenChange: (open: boolean) => void;
  onDraftEnabledChange: (enabled: boolean) => void;
  onDraftWeightChange: (assignmentId: string, weight: number) => void;
  onReset: () => void;
  onSave: () => void;
};

const WeightSettingsDialog = ({ open, enabled, draftEnabled, assignments, draftWeights, onOpenChange, onDraftEnabledChange, onDraftWeightChange, onReset, onSave }: WeightSettingsDialogProps) => {
  const totalWeight = draftWeights.reduce((sum, item) => sum + item.weight, 0);
  const isValidTotal = Math.abs(totalWeight - 100) < 0.001;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='rounded-xl sm:max-w-2xl'>
        <DialogHeader className='gap-1'>
          <DialogTitle className='text-primary text-lg font-bold'>Atur Bobot Assignment</DialogTitle>
          <DialogDescription className='text-xs text-black/40'>Simulasi bobot ini hanya indikator tambahan, bukan komponen nilai utama.</DialogDescription>
        </DialogHeader>

        <div className='space-y-5'>
          <div className='flex items-center justify-between gap-4 rounded-lg border border-accent bg-secondary px-4 py-3'>
            <div className='space-y-1'>
              <Label htmlFor='weight-enabled' className='text-primary'>
                Aktifkan simulasi bobot
              </Label>
              <p className='text-xs text-accent'>{enabled ? 'Simulasi bobot sedang aktif pada dashboard.' : 'Dashboard masih memakai points asli sampai simulasi diaktifkan.'}</p>
            </div>
            <Switch id='weight-enabled' checked={draftEnabled} onCheckedChange={onDraftEnabledChange} />
          </div>

          <div className='space-y-3'>
            {assignments.map((assignment) => {
              const value = draftWeights.find((item) => item.assignmentId === assignment.id)?.weight ?? 0;
              return (
                <div key={assignment.id} className='grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_140px]'>
                  <Label htmlFor={`weight-${assignment.id}`} className='text-xs font-semibold text-primary md:text-sm'>
                    {formatAssignmentLabel(assignment)}
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      id={`weight-${assignment.id}`}
                      type='number'
                      min={0}
                      max={100}
                      step='0.01'
                      value={value}
                      onChange={(event) => onDraftWeightChange(assignment.id, Number(event.target.value))}
                      className='border-accent text-xs text-primary md:text-sm'
                    />
                    <span className='text-xs font-semibold text-accent'>%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`rounded-lg border px-4 py-3 text-xs font-semibold ${isValidTotal ? 'border-accent bg-secondary text-primary' : 'border-destructive/40 bg-destructive/5 text-destructive'}`}>
            Total bobot: {formatScore(totalWeight)}%{!isValidTotal && <span className='ml-2 font-normal'>Total bobot harus 100%.</span>}
          </div>
        </div>

        <DialogFooter>
          <Button type='button' variant='secondary' className='border bg-accent shadow-sm hover:opacity-85' onClick={onReset}>
            Reset
          </Button>
          <Button type='button' className='shadow-sm' disabled={!isValidTotal} onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WeightSettingsDialog;
