import { TASK_FILTER_ALL, TASK_STATUS_OPTIONS } from '@/components/pages/Dosen/StudyGroup/TopikDetail/constant';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/cn';
import type { Task } from '@/types/task';
import { Icon } from '@iconify/react';

export type TaskFilterValue = {
  memberId: string;
  status: 'all' | Task['status'];
};

export type TaskMemberOption = {
  id: string;
  nama: string;
};

type TaskFilterDropdownProps = {
  value: TaskFilterValue;
  onValueChange: (value: TaskFilterValue) => void;
  members: TaskMemberOption[];
  label?: string;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  widthClassName?: string;
  icon?: string;
};

const TaskFilterDropdown = ({ value, onValueChange, members, label = 'Filter by..', className, buttonClassName, contentClassName, widthClassName = 'w-80', icon = 'mdi:filter-variant' }: TaskFilterDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            `
            flex items-center gap-2 border border-black/20 bg-white text-black/30 shadow-sm hover:bg-primary
            hover:text-white
			`,
            buttonClassName,
          )}
        >
          <Icon icon={icon} />
          {label}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={cn(widthClassName, 'border-accent p-3', contentClassName)} align='end' sideOffset={10}>
        <div className={cn('flex flex-col gap-4', className)}>
          <div className='flex flex-col gap-2'>
            <span className='text-xs text-primary font-bold'>Nama</span>
            <Select value={value.memberId} onValueChange={(v) => onValueChange({ ...value, memberId: v })}>
              <SelectTrigger className='w-full border-accent'>
                <SelectValue placeholder='Semua' />
              </SelectTrigger>
              <SelectContent className='border-accent'>
                <SelectItem value={TASK_FILTER_ALL}>Semua</SelectItem>
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <span className='text-xs text-primary font-bold'>Status</span>
            <Select value={value.status} onValueChange={(v) => onValueChange({ ...value, status: v as TaskFilterValue['status'] })}>
              <SelectTrigger className='w-full border-accent'>
                <SelectValue placeholder='Semua' />
              </SelectTrigger>
              <SelectContent className='border-accent'>
                <SelectItem value={TASK_FILTER_ALL}>Semua</SelectItem>
                {TASK_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TaskFilterDropdown;
