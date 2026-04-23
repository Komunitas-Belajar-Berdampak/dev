import type { StudyGroupByMembership } from '@/types/sg';

export type StudyGroupListAction = { kind: 'none' } | { kind: 'icon'; label: 'PENDING' | 'REJECTED'; disabled: true } | { kind: 'edit'; label: 'APPROVED'; disabled: false } | { kind: 'request'; label: 'REQUEST'; disabled: false };

export function getStudyGroupAction(sg: StudyGroupByMembership, hasApprovedMembership: boolean): StudyGroupListAction {
  if (sg.statusMember === 'APPROVED') return { kind: 'edit', label: 'APPROVED', disabled: false };

  if (sg.status) return { kind: 'none' };

  if (sg.statusMember === 'PENDING') return { kind: 'icon', label: 'PENDING', disabled: true };
  if (sg.statusMember === 'REJECTED') return { kind: 'icon', label: 'REJECTED', disabled: true };

  const isFull = sg.totalAnggota >= sg.kapasitas;
  if (isFull) return { kind: 'none' };

  if (hasApprovedMembership) return { kind: 'none' };

  return { kind: 'request', label: 'REQUEST', disabled: false };
}
