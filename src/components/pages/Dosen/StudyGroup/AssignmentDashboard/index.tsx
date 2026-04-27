import { getStudyGroupAssignmentDashboard } from '@/api/study-group';
import NoData from '@/components/shared/NoData';
import Title from '@/components/shared/Title';
import ErrorMessage from '@/components/ui/error';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupAssignmentDashboard } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ContributionCharts from './components/ContributionCharts';
import ContributionMatrix from './components/ContributionMatrix';
import DashboardFilters from './components/DashboardFilters';
import DashboardInfoNote from './components/DashboardInfoNote';
import DashboardSkeleton from './components/DashboardSkeleton';
import SummaryCards from './components/SummaryCards';
import WeightSettingsDialog from './components/WeightSettingsDialog';
import { useAssignmentDashboardView } from './hooks/useAssignmentDashboardView';
import { useAssignmentDashboardWeights } from './hooks/useAssignmentDashboardWeights';
import { ALL_ASSIGNMENTS } from './utils/constants';
import type { DashboardMode } from './utils/types';

const StudyGroupAssignmentDashboardPage = () => {
  const { namaMatkul, idMatkul } = useParams<{ namaMatkul: string; idMatkul: string }>();
  const [mode, setMode] = useState<DashboardMode>('all');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(ALL_ASSIGNMENTS);
  const [studentSearch, setStudentSearch] = useState('');

  const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }, { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` }, { label: 'Dashboard Assignment' }];

  const { data, isLoading, isError, error } = useQuery<ApiResponse<StudyGroupAssignmentDashboard>, Error, StudyGroupAssignmentDashboard>({
    queryKey: ['sg-assignment-dashboard', idMatkul],
    queryFn: () => getStudyGroupAssignmentDashboard(String(idMatkul)),
    select: (res) => res.data,
    enabled: Boolean(idMatkul),
  });

  const { isWeightDialogOpen, isWeightEnabled, draftWeightEnabled, weights, draftWeights, setIsWeightDialogOpen, setDraftWeightEnabled, openWeightDialog, handleDraftWeightChange, resetWeights, saveWeights } =
    useAssignmentDashboardWeights(data);

  const { assignments, rows, visibleRows, summary, maxCellPoints, heatmapSeries, heatmapHeight, heatmapOptions, topContributorSeries, topContributorOptions } = useAssignmentDashboardView({
    data,
    mode,
    selectedGroupId,
    selectedAssignmentId,
    studentSearch,
    isWeightEnabled,
    weights,
  });

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data dashboard assignment.', { toasterId: 'global' });
  }, [error?.message, isError]);

  useEffect(() => {
    if (!data || selectedGroupId) return;
    setSelectedGroupId(data.groups[0]?.id ?? '');
  }, [data, selectedGroupId]);

  if (isLoading)
    return (
      <>
        <Title title='Dashboard Assignment' items={breadcrumbItems} />
        <DashboardSkeleton />
      </>
    );

  if (isError)
    return (
      <>
        <Title title='Dashboard Assignment' items={breadcrumbItems} />
        <ErrorMessage message='Tidak dapat memuat dashboard assignment.' />
      </>
    );

  if (!data || data.groups.length === 0 || data.assignments.length === 0)
    return (
      <>
        <Title title='Dashboard Assignment' items={breadcrumbItems} />
        <NoData message='Belum ada data Study Group atau assignment untuk dashboard ini.' />
      </>
    );

  return (
    <>
      <Title title='Dashboard Assignment' items={breadcrumbItems} />

      <div className='space-y-6'>
        <DashboardFilters
          mode={mode}
          selectedGroupId={selectedGroupId}
          selectedAssignmentId={selectedAssignmentId}
          studentSearch={studentSearch}
          groups={data.groups}
          assignments={data.assignments}
          onModeChange={setMode}
          onGroupChange={setSelectedGroupId}
          onAssignmentChange={setSelectedAssignmentId}
          onStudentSearchChange={setStudentSearch}
          onOpenWeightDialog={openWeightDialog}
        />

        <SummaryCards summary={summary} isWeightEnabled={isWeightEnabled} />

        <ContributionMatrix mode={mode} assignments={assignments} rows={rows} visibleRows={visibleRows} maxCellPoints={maxCellPoints} isWeightEnabled={isWeightEnabled} />

        <ContributionCharts
          visibleRowsLength={visibleRows.length}
          isWeightEnabled={isWeightEnabled}
          heatmapSeries={heatmapSeries}
          heatmapOptions={heatmapOptions}
          heatmapHeight={heatmapHeight}
          topContributorSeries={topContributorSeries}
          topContributorOptions={topContributorOptions}
        />

        <DashboardInfoNote />
      </div>

      <WeightSettingsDialog
        open={isWeightDialogOpen}
        enabled={isWeightEnabled}
        draftEnabled={draftWeightEnabled}
        assignments={data.assignments}
        draftWeights={draftWeights}
        onOpenChange={setIsWeightDialogOpen}
        onDraftEnabledChange={setDraftWeightEnabled}
        onDraftWeightChange={handleDraftWeightChange}
        onReset={resetWeights}
        onSave={saveWeights}
      />
    </>
  );
};

export default StudyGroupAssignmentDashboardPage;
