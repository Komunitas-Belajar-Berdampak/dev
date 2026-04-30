import type { StudyGroupAssignmentDashboard } from '@/types/sg';
import { useMemo } from 'react';
import { ALL_ASSIGNMENTS } from '../utils/constants';
import { getAssignmentDominance, getStudentRows, getWeightByAssignment } from '../utils/dashboard-calculations';
import { formatScore } from '../utils/formatters';
import { getHeatmapOptions, getTopContributorOptions } from '../utils/chart-options';
import type { DashboardMode } from '../utils/types';

type UseAssignmentDashboardViewOptions = {
  data?: StudyGroupAssignmentDashboard;
  mode: DashboardMode;
  selectedGroupId: string;
  selectedAssignmentId: string;
  studentSearch: string;
  isWeightEnabled: boolean;
  weights: StudyGroupAssignmentDashboard['weights'];
};

export const useAssignmentDashboardView = ({ data, mode, selectedGroupId, selectedAssignmentId, studentSearch, isWeightEnabled, weights }: UseAssignmentDashboardViewOptions) => {
  const assignments = useMemo(() => {
    if (!data) return [];
    if (selectedAssignmentId === ALL_ASSIGNMENTS) return data.assignments;
    return data.assignments.filter((assignment) => assignment.id === selectedAssignmentId);
  }, [data, selectedAssignmentId]);

  const students = useMemo(() => {
    if (!data) return [];
    if (mode === 'all') return data.students;
    return data.students.filter((student) => student.groupId === selectedGroupId);
  }, [data, mode, selectedGroupId]);

  const rows = useMemo(() => {
    if (!data) return [];
    return getStudentRows(data, students, weights);
  }, [data, students, weights]);

  const searchedRows = useMemo(() => {
    const keyword = studentSearch.trim().toLowerCase();
    if (!keyword) return rows;

    return rows.filter((row) => {
      const haystack = `${row.nama} ${row.nrp} ${row.groupName}`.toLowerCase();
      return haystack.includes(keyword);
    });
  }, [rows, studentSearch]);

  const visibleRows = useMemo(() => {
    if (selectedAssignmentId === ALL_ASSIGNMENTS) return searchedRows;
    const weightByAssignment = getWeightByAssignment(weights);
    return searchedRows
      .map((row) => ({
        ...row,
        totalPoints: row.pointsByAssignment[selectedAssignmentId] ?? 0,
        weightedScore: (row.pointsByAssignment[selectedAssignmentId] ?? 0) * ((weightByAssignment.get(selectedAssignmentId) ?? 0) / 100),
      }))
      .sort((a, b) => (isWeightEnabled ? b.weightedScore - a.weightedScore : b.totalPoints - a.totalPoints));
  }, [isWeightEnabled, searchedRows, selectedAssignmentId, weights]);

  const summary = useMemo(() => {
    const totalPoints = visibleRows.reduce((sum, row) => sum + row.totalPoints, 0);
    const totalWeightedScore = visibleRows.reduce((sum, row) => sum + row.weightedScore, 0);
    const topContributorRows = [...visibleRows].sort((a, b) => (isWeightEnabled ? b.weightedScore - a.weightedScore : b.totalPoints - a.totalPoints));
    const topContributor = topContributorRows.find((row) => (isWeightEnabled ? row.weightedScore : row.totalPoints) > 0) ?? null;
    const inactiveStudents = visibleRows.filter((row) => row.totalPoints === 0).length;
    const assignmentPalingTimpang = getAssignmentDominance(assignments, rows);

    return {
      totalPoints,
      totalWeightedScore,
      topContributor,
      inactiveStudents,
      assignmentPalingTimpang,
    };
  }, [assignments, isWeightEnabled, rows, visibleRows]);

  const maxCellPoints = useMemo(() => {
    return Math.max(...visibleRows.flatMap((row) => assignments.map((assignment) => row.pointsByAssignment[assignment.id] ?? 0)), 0);
  }, [assignments, visibleRows]);

  const heatmapSeries = useMemo(() => {
    return visibleRows.map((row) => ({
      name: row.nama,
      data: assignments.map((assignment) => ({
        x: `P${assignment.pertemuan}`,
        y: row.pointsByAssignment[assignment.id] ?? 0,
      })),
    }));
  }, [assignments, visibleRows]);

  const heatmapHeight = useMemo(() => Math.max(320, visibleRows.length * 34), [visibleRows.length]);
  const heatmapOptions = useMemo(() => getHeatmapOptions(), []);

  const topContributorRows = useMemo(() => {
    return [...visibleRows].sort((a, b) => (isWeightEnabled ? b.weightedScore - a.weightedScore : b.totalPoints - a.totalPoints)).slice(0, 5);
  }, [isWeightEnabled, visibleRows]);

  const topContributorSeries = useMemo(
    () => [{ name: isWeightEnabled ? 'Weighted Score' : 'Points', data: topContributorRows.map((row) => (isWeightEnabled ? Number(formatScore(row.weightedScore)) : row.totalPoints)) }],
    [isWeightEnabled, topContributorRows],
  );

  const topContributorOptions = useMemo(() => getTopContributorOptions(topContributorRows, isWeightEnabled), [isWeightEnabled, topContributorRows]);

  return {
    assignments,
    rows,
    visibleRows,
    summary,
    maxCellPoints,
    heatmapSeries,
    heatmapHeight,
    heatmapOptions,
    topContributorSeries,
    topContributorOptions,
  };
};
