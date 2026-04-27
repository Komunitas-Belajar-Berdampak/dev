import type { StudyGroupAssignmentDashboard, StudyGroupAssignmentDashboardAssignment, StudyGroupAssignmentDashboardStudent, StudyGroupAssignmentWeight } from '@/types/sg';
import type { AssignmentDominance, StudentContributionRow } from './types';

export const getCellBackground = (points: number, maxPoints: number) => {
  if (points === 0 || maxPoints === 0) return 'transparent';
  const opacity = Math.min(0.12 + (points / maxPoints) * 0.42, 0.54);
  return `rgba(13, 0, 194, ${opacity})`;
};

export const createEqualWeights = (assignments: StudyGroupAssignmentDashboardAssignment[]): StudyGroupAssignmentWeight[] => {
  if (assignments.length === 0) return [];

  const baseWeight = Math.floor((100 / assignments.length) * 100) / 100;
  const weights = assignments.map((assignment) => ({ assignmentId: assignment.id, weight: baseWeight }));
  const currentTotal = weights.reduce((sum, item) => sum + item.weight, 0);
  weights[weights.length - 1] = {
    ...weights[weights.length - 1],
    weight: Math.round((weights[weights.length - 1].weight + (100 - currentTotal)) * 100) / 100,
  };

  return weights;
};

export const getWeightByAssignment = (weights: StudyGroupAssignmentWeight[]) => {
  return new Map(weights.map((item) => [item.assignmentId, item.weight]));
};

export const getDefaultWeights = (data: StudyGroupAssignmentDashboard) => {
  const totalWeight = data.weights.reduce((sum, item) => sum + item.weight, 0);
  const isComplete = data.weights.length === data.assignments.length && data.assignments.every((assignment) => data.weights.some((item) => item.assignmentId === assignment.id));

  if (isComplete && Math.abs(totalWeight - 100) < 0.001) return data.weights;
  return createEqualWeights(data.assignments);
};

export const getStudentRows = (data: StudyGroupAssignmentDashboard, students: StudyGroupAssignmentDashboardStudent[], weights: StudyGroupAssignmentWeight[]): StudentContributionRow[] => {
  const weightByAssignment = getWeightByAssignment(weights);

  return students
    .map((student) => {
      const pointsByAssignment = data.assignments.reduce<Record<string, number>>((acc, assignment) => {
        acc[assignment.id] = data.matrix.find((item) => item.studentId === student.id && item.assignmentId === assignment.id)?.points ?? 0;
        return acc;
      }, {});

      return {
        ...student,
        pointsByAssignment,
        totalPoints: Object.values(pointsByAssignment).reduce((sum, points) => sum + points, 0),
        weightedScore: Object.entries(pointsByAssignment).reduce((sum, [assignmentId, points]) => sum + points * ((weightByAssignment.get(assignmentId) ?? 0) / 100), 0),
      };
    })
    .sort((a, b) => b.totalPoints - a.totalPoints);
};

export const getAssignmentDominance = (assignments: StudyGroupAssignmentDashboardAssignment[], rows: StudentContributionRow[]) => {
  return assignments.reduce<AssignmentDominance | null>((top, assignment) => {
    const assignmentTotal = rows.reduce((sum, row) => sum + row.pointsByAssignment[assignment.id], 0);
    if (assignmentTotal === 0) return top;

    const dominantRow = rows.reduce((dominant, row) => (row.pointsByAssignment[assignment.id] > dominant.pointsByAssignment[assignment.id] ? row : dominant), rows[0]);
    const dominancePercentage = (dominantRow.pointsByAssignment[assignment.id] / assignmentTotal) * 100;

    if (!top || dominancePercentage > top.dominancePercentage) {
      return {
        assignmentId: assignment.id,
        judul: assignment.judul,
        studentName: dominantRow.nama,
        dominancePercentage,
      };
    }

    return top;
  }, null);
};
