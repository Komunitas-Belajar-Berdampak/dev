import type { StudyGroupAssignmentDashboard, StudyGroupAssignmentWeight } from '@/types/sg';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getDefaultWeights } from '../utils/dashboard-calculations';

export const useAssignmentDashboardWeights = (data?: StudyGroupAssignmentDashboard) => {
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isWeightEnabled, setIsWeightEnabled] = useState(false);
  const [draftWeightEnabled, setDraftWeightEnabled] = useState(false);
  const [weights, setWeights] = useState<StudyGroupAssignmentWeight[]>([]);
  const [draftWeights, setDraftWeights] = useState<StudyGroupAssignmentWeight[]>([]);

  useEffect(() => {
    if (!data) return;
    const defaultWeights = getDefaultWeights(data);
    setWeights(defaultWeights);
    setDraftWeights(defaultWeights);
    setIsWeightEnabled(false);
    setDraftWeightEnabled(false);
  }, [data]);

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
