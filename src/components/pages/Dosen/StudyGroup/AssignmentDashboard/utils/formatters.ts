import type { StudyGroupAssignmentDashboardAssignment } from '@/types/sg';

export const formatAssignmentLabel = (assignment: StudyGroupAssignmentDashboardAssignment) => `P${assignment.pertemuan} - ${assignment.judul}`;

export const formatPercent = (value: number) => `${Math.round(value)}%`;

export const formatScore = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2);
};
