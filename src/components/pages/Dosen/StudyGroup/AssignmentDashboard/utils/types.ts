import type { StudyGroupAssignmentDashboardStudent } from '@/types/sg';

export type DashboardMode = 'all' | 'group';

export type StudentContributionRow = StudyGroupAssignmentDashboardStudent & {
  totalPoints: number;
  weightedScore: number;
  pointsByAssignment: Record<string, number>;
};

export type AssignmentDominance = {
  assignmentId: string;
  judul: string;
  studentName: string;
  dominancePercentage: number;
};
