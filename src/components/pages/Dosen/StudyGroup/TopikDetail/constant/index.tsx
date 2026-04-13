import type { Task } from '@/types/task';
import { Check, ClipboardList, Clock2 } from 'lucide-react';

export const listIcons = [
  {
    label: 'Completed',
    icon: <Check className='text-white' size={12} />,
  },
  {
    label: 'On Progress',
    icon: <Clock2 className='text-primary' size={16} />,
  },
  {
    label: 'Do',
    icon: <ClipboardList className='text-primary' size={16} />,
  },
];

export const tableHeaders = ['Task', 'People', 'Status', 'Actions'];

export const TASK_FILTER_ALL = 'all' as const;

export const TASK_STATUS_OPTIONS: Array<{ label: string; value: Task['status'] }> = [
  { label: 'To Do', value: 'DO' },
  { label: 'In Progress', value: 'IN PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

export function getTaskStatusLabel(value: Task['status']): string {
  return TASK_STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export const KONTRIBUSI_ALL_THREAD_VALUE = 'all';
export const KONTRIBUSI_EMPTY_MOST_ACTIVE_DAY = '-';
export const KONTRIBUSI_TREND_BAR_COLOR = 'oklch(0.3392 0.2233 264.1868)';
