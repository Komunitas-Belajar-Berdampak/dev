import { getLocalStorage, setLocalStorage } from '@/lib/storage';
import type { StudyGroupAssignmentDashboard, StudyGroupAssignmentWeight } from '@/types/sg';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getDefaultWeights } from '../utils/dashboard-calculations';

type StoredAssignmentDashboardWeights = {
  enabled: boolean;
  weights: StudyGroupAssignmentWeight[];
};

const STORAGE_KEY_PREFIX = 'sg_assignment_dashboard_weights';

const getStorageKey = (courseId: string) => `${STORAGE_KEY_PREFIX}:${courseId}`;

const getValidStoredWeights = (stored: StoredAssignmentDashboardWeights | null, data: StudyGroupAssignmentDashboard) => {
  if (!stored || typeof stored.enabled !== 'boolean' || !Array.isArray(stored.weights)) return null;
  if (stored.weights.length !== data.assignments.length) return null;

  const assignmentIds = new Set(data.assignments.map((assignment) => assignment.id));
  const storedAssignmentIds = new Set(stored.weights.map((item) => item.assignmentId));
  const totalWeight = stored.weights.reduce((sum, item) => sum + item.weight, 0);

  if (storedAssignmentIds.size !== assignmentIds.size) return null;
  if (Math.abs(totalWeight - 100) >= 0.001) return null;

  const isValid = data.assignments.every((assignment) => storedAssignmentIds.has(assignment.id)) && stored.weights.every((item) => assignmentIds.has(item.assignmentId) && Number.isFinite(item.weight));
  return isValid ? stored : null;
};

export const useAssignmentDashboardWeights = (courseId: string, data?: StudyGroupAssignmentDashboard) => {
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isWeightEnabled, setIsWeightEnabled] = useState(false);
  const [draftWeightEnabled, setDraftWeightEnabled] = useState(false);
  const [weights, setWeights] = useState<StudyGroupAssignmentWeight[]>([]);
  const [draftWeights, setDraftWeights] = useState<StudyGroupAssignmentWeight[]>([]);

  useEffect(() => {
    if (!courseId || !data) return;
    const defaultWeights = getDefaultWeights(data);
    const stored = getLocalStorage<StoredAssignmentDashboardWeights>(getStorageKey(courseId));
    const validStored = getValidStoredWeights(stored, data);
    const nextEnabled = validStored?.enabled ?? false;
    const nextWeights = validStored?.weights ?? defaultWeights;

    setWeights(nextWeights);
    setDraftWeights(nextWeights);
    setIsWeightEnabled(nextEnabled);
    setDraftWeightEnabled(nextEnabled);
  }, [courseId, data]);

  const openWeightDialog = () => {
    setDraftWeights(weights);
    setDraftWeightEnabled(isWeightEnabled);
    setIsWeightDialogOpen(true);
  };

  const handleDraftWeightChange = (assignmentId: string, weight: number) => {
    const nextWeight = Number.isFinite(weight) ? Math.min(Math.max(weight, 0), 100) : 0;
    setDraftWeights((current) => current.map((item) => (item.assignmentId === assignmentId ? { ...item, weight: nextWeight } : item)));
  };

  const resetWeights = () => {
    if (!data) return;
    const defaultWeights = getDefaultWeights(data);
    setDraftWeights(defaultWeights);
    setDraftWeightEnabled(false);
  };

  const saveWeights = () => {
    const totalWeight = draftWeights.reduce((sum, item) => sum + item.weight, 0);
    if (Math.abs(totalWeight - 100) >= 0.001) return;

    setWeights(draftWeights);
    setIsWeightEnabled(draftWeightEnabled);
    setLocalStorage(getStorageKey(courseId), {
      enabled: draftWeightEnabled,
      weights: draftWeights,
    });
    setIsWeightDialogOpen(false);
    toast.success(draftWeightEnabled ? 'Simulasi bobot berhasil diaktifkan.' : 'Simulasi bobot dinonaktifkan.', { toasterId: 'global' });
  };

  return {
    isWeightDialogOpen,
    isWeightEnabled,
    draftWeightEnabled,
    weights,
    draftWeights,
    setIsWeightDialogOpen,
    setDraftWeightEnabled,
    openWeightDialog,
    handleDraftWeightChange,
    resetWeights,
    saveWeights,
  };
};
