import type { Task } from '@/types/task';

export const tableHeaders = ['Task', 'People', 'Status', 'Actions'];

export const TASK_STATUS_OPTIONS: Array<{ label: string; value: Task['status'] }> = [
  { label: 'To Do', value: 'DO' },
  { label: 'In Progress', value: 'IN PROGRESS' },
  { label: 'Done', value: 'DONE' },
];

export function getTaskStatusLabel(value: Task['status']): string {
  return TASK_STATUS_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export const TASK_FILTER_ALL = 'all' as const;
