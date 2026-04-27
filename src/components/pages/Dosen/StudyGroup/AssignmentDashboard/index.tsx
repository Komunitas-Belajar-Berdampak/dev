import { getStudyGroupAssignmentDashboard } from '@/api/study-group';
import NoData from '@/components/shared/NoData';
import Search from '@/components/shared/Search';
import Title from '@/components/shared/Title';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ErrorMessage from '@/components/ui/error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupAssignmentDashboard, StudyGroupAssignmentDashboardAssignment, StudyGroupAssignmentDashboardStudent, StudyGroupAssignmentWeight } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import type { ApexOptions } from 'apexcharts';
import { Activity, BarChart3, Percent, Settings2, TriangleAlert, UserRoundCheck, type LucideIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

type DashboardMode = 'all' | 'group';

type StudentContributionRow = StudyGroupAssignmentDashboardStudent & {
  totalPoints: number;
  weightedScore: number;
  pointsByAssignment: Record<string, number>;
};

const ALL_ASSIGNMENTS = 'all';
const PRIMARY_CHART_COLOR = '#0d00c2';
const SECONDARY_CHART_COLOR = '#e5e7eb';

const formatAssignmentLabel = (assignment: StudyGroupAssignmentDashboardAssignment) => `P${assignment.pertemuan} - ${assignment.judul}`;

const formatPercent = (value: number) => `${Math.round(value)}%`;

const formatScore = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(2);
};

const getCellBackground = (points: number, maxPoints: number) => {
  if (points === 0 || maxPoints === 0) return 'transparent';
  const opacity = Math.min(0.12 + (points / maxPoints) * 0.42, 0.54);
  return `rgba(13, 0, 194, ${opacity})`;
};

const createEqualWeights = (assignments: StudyGroupAssignmentDashboardAssignment[]): StudyGroupAssignmentWeight[] => {
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

const getWeightByAssignment = (weights: StudyGroupAssignmentWeight[]) => {
  return new Map(weights.map((item) => [item.assignmentId, item.weight]));
};

const getDefaultWeights = (data: StudyGroupAssignmentDashboard) => {
  const totalWeight = data.weights.reduce((sum, item) => sum + item.weight, 0);
  const isComplete = data.weights.length === data.assignments.length && data.assignments.every((assignment) => data.weights.some((item) => item.assignmentId === assignment.id));

  if (isComplete && Math.abs(totalWeight - 100) < 0.001) return data.weights;
  return createEqualWeights(data.assignments);
};

const getStudentRows = (data: StudyGroupAssignmentDashboard, students: StudyGroupAssignmentDashboardStudent[], weights: StudyGroupAssignmentWeight[]): StudentContributionRow[] => {
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

const getAssignmentDominance = (assignments: StudyGroupAssignmentDashboardAssignment[], rows: StudentContributionRow[]) => {
  return assignments.reduce<{
    assignmentId: string;
    judul: string;
    studentName: string;
    dominancePercentage: number;
  } | null>((top, assignment) => {
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

const WeightSettingsDialog = ({
  open,
  enabled,
  draftEnabled,
  assignments,
  draftWeights,
  onOpenChange,
  onDraftEnabledChange,
  onDraftWeightChange,
  onReset,
  onSave,
}: {
  open: boolean;
  enabled: boolean;
  draftEnabled: boolean;
  assignments: StudyGroupAssignmentDashboardAssignment[];
  draftWeights: StudyGroupAssignmentWeight[];
  onOpenChange: (open: boolean) => void;
  onDraftEnabledChange: (enabled: boolean) => void;
  onDraftWeightChange: (assignmentId: string, weight: number) => void;
  onReset: () => void;
  onSave: () => void;
}) => {
  const totalWeight = draftWeights.reduce((sum, item) => sum + item.weight, 0);
  const isValidTotal = Math.abs(totalWeight - 100) < 0.001;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='rounded-xl sm:max-w-2xl'>
        <DialogHeader className='gap-1'>
          <DialogTitle className='text-primary text-lg font-bold'>Atur Bobot Assignment</DialogTitle>
          <DialogDescription className='text-xs text-black/40'>Simulasi bobot ini hanya indikator tambahan, bukan komponen nilai utama.</DialogDescription>
        </DialogHeader>

        <div className='space-y-5'>
          <div className='flex items-center justify-between gap-4 rounded-lg border border-accent bg-secondary px-4 py-3'>
            <div className='space-y-1'>
              <Label htmlFor='weight-enabled' className='text-primary'>
                Aktifkan simulasi bobot
              </Label>
              <p className='text-xs text-accent'>{enabled ? 'Simulasi bobot sedang aktif pada dashboard.' : 'Dashboard masih memakai points asli sampai simulasi diaktifkan.'}</p>
            </div>
            <Switch id='weight-enabled' checked={draftEnabled} onCheckedChange={onDraftEnabledChange} />
          </div>

          <div className='space-y-3'>
            {assignments.map((assignment) => {
              const value = draftWeights.find((item) => item.assignmentId === assignment.id)?.weight ?? 0;
              return (
                <div key={assignment.id} className='grid grid-cols-1 items-center gap-2 md:grid-cols-[minmax(0,1fr)_140px]'>
                  <Label htmlFor={`weight-${assignment.id}`} className='text-xs font-semibold text-primary md:text-sm'>
                    {formatAssignmentLabel(assignment)}
                  </Label>
                  <div className='flex items-center gap-2'>
                    <Input
                      id={`weight-${assignment.id}`}
                      type='number'
                      min={0}
                      max={100}
                      step='0.01'
                      value={value}
                      onChange={(event) => onDraftWeightChange(assignment.id, Number(event.target.value))}
                      className='border-accent text-xs text-primary md:text-sm'
                    />
                    <span className='text-xs font-semibold text-accent'>%</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`rounded-lg border px-4 py-3 text-xs font-semibold ${isValidTotal ? 'border-accent bg-secondary text-primary' : 'border-destructive/40 bg-destructive/5 text-destructive'}`}>
            Total bobot: {formatScore(totalWeight)}%{!isValidTotal && <span className='ml-2 font-normal'>Total bobot harus 100%.</span>}
          </div>
        </div>

        <DialogFooter>
          <Button type='button' variant='secondary' className='border bg-accent shadow-sm hover:opacity-85' onClick={onReset}>
            Reset
          </Button>
          <Button type='button' className='shadow-sm' disabled={!isValidTotal} onClick={onSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DashboardSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent bg-white p-4 shadow-sm'>
        <Skeleton className='h-10 w-64' />
        <Skeleton className='h-10 w-72' />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {[...Array(4)].map((_, index) => (
          <Skeleton key={index} className='h-28 rounded-xl' />
        ))}
      </div>
      <Skeleton className='h-96 rounded-xl' />
      <Skeleton className='h-80 rounded-xl' />
    </div>
  );
};

const SummaryCard = ({ title, value, description, icon: Icon }: { title: string; value: string; description: string; icon: LucideIcon }) => {
  return (
    <Card className='border-accent bg-white shadow-sm'>
      <CardHeader className='flex flex-row items-center justify-between gap-4 pb-0'>
        <CardTitle className='text-xs font-semibold text-accent'>{title}</CardTitle>
        <div className='flex size-9 items-center justify-center rounded-lg bg-secondary'>
          <Icon className='size-4 text-primary' />
        </div>
      </CardHeader>
      <CardContent className='space-y-1'>
        <p className='text-lg font-bold text-primary md:text-xl'>{value}</p>
        <p className='text-xs text-accent'>{description}</p>
      </CardContent>
    </Card>
  );
};

const StudyGroupAssignmentDashboardPage = () => {
  const { namaMatkul, idMatkul } = useParams<{ namaMatkul: string; idMatkul: string }>();
  const [mode, setMode] = useState<DashboardMode>('all');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(ALL_ASSIGNMENTS);
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [isWeightEnabled, setIsWeightEnabled] = useState(false);
  const [draftWeightEnabled, setDraftWeightEnabled] = useState(false);
  const [weights, setWeights] = useState<StudyGroupAssignmentWeight[]>([]);
  const [draftWeights, setDraftWeights] = useState<StudyGroupAssignmentWeight[]>([]);
  const [studentSearch, setStudentSearch] = useState('');

  const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }, { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` }, { label: 'Dashboard Assignment' }];

  const { data, isLoading, isError, error } = useQuery<ApiResponse<StudyGroupAssignmentDashboard>, Error, StudyGroupAssignmentDashboard>({
    queryKey: ['sg-assignment-dashboard', idMatkul],
    queryFn: () => getStudyGroupAssignmentDashboard(String(idMatkul)),
    select: (res) => res.data,
    enabled: Boolean(idMatkul),
  });

  useEffect(() => {
    if (!isError) return;
    toast.error(error?.message || 'Gagal mengambil data dashboard assignment.', { toasterId: 'global' });
  }, [error?.message, isError]);

  useEffect(() => {
    if (!data || selectedGroupId) return;
    setSelectedGroupId(data.groups[0]?.id ?? '');
  }, [data, selectedGroupId]);

  useEffect(() => {
    if (!data) return;
    const defaultWeights = getDefaultWeights(data);
    setWeights(defaultWeights);
    setDraftWeights(defaultWeights);
    setIsWeightEnabled(false);
    setDraftWeightEnabled(false);
  }, [data]);

  const handleOpenWeightDialog = () => {
    setDraftWeights(weights);
    setDraftWeightEnabled(isWeightEnabled);
    setIsWeightDialogOpen(true);
  };

  const handleDraftWeightChange = (assignmentId: string, weight: number) => {
    const nextWeight = Number.isFinite(weight) ? Math.min(Math.max(weight, 0), 100) : 0;
    setDraftWeights((current) => current.map((item) => (item.assignmentId === assignmentId ? { ...item, weight: nextWeight } : item)));
  };

  const handleResetWeights = () => {
    if (!data) return;
    const defaultWeights = getDefaultWeights(data);
    setDraftWeights(defaultWeights);
    setDraftWeightEnabled(false);
  };

  const handleSaveWeights = () => {
    const totalWeight = draftWeights.reduce((sum, item) => sum + item.weight, 0);
    if (Math.abs(totalWeight - 100) >= 0.001) return;

    setWeights(draftWeights);
    setIsWeightEnabled(draftWeightEnabled);
    setIsWeightDialogOpen(false);
    toast.success(draftWeightEnabled ? 'Simulasi bobot berhasil diaktifkan.' : 'Simulasi bobot dinonaktifkan.', { toasterId: 'global' });
  };

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

  const heatmapOptions = useMemo<ApexOptions>(
    () => ({
      chart: { type: 'heatmap', toolbar: { show: false } },
      dataLabels: { enabled: false },
      colors: [PRIMARY_CHART_COLOR],
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.75,
          colorScale: {
            ranges: [
              { from: 0, to: 0, color: SECONDARY_CHART_COLOR, name: '0 points' },
              { from: 1, to: 20, color: '#c7d2fe', name: 'Rendah' },
              { from: 21, to: 50, color: '#818cf8', name: 'Sedang' },
              { from: 51, to: 100, color: PRIMARY_CHART_COLOR, name: 'Tinggi' },
            ],
          },
        },
      },
      xaxis: {
        labels: { style: { colors: '#6b7280', fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#4b5563', fontSize: '11px' }, maxWidth: 170 } },
      grid: { borderColor: '#f1f5f9' },
      tooltip: { y: { formatter: (value) => `${value} points` } },
      legend: { labels: { colors: '#4b5563' } },
    }),
    [],
  );

  const topContributorRows = useMemo(() => {
    return [...visibleRows].sort((a, b) => (isWeightEnabled ? b.weightedScore - a.weightedScore : b.totalPoints - a.totalPoints)).slice(0, 5);
  }, [isWeightEnabled, visibleRows]);

  const topContributorSeries = useMemo(
    () => [{ name: isWeightEnabled ? 'Weighted Score' : 'Points', data: topContributorRows.map((row) => (isWeightEnabled ? Number(formatScore(row.weightedScore)) : row.totalPoints)) }],
    [isWeightEnabled, topContributorRows],
  );

  const topContributorOptions = useMemo<ApexOptions>(
    () => ({
      chart: { type: 'bar', toolbar: { show: false } },
      colors: [PRIMARY_CHART_COLOR],
      plotOptions: { bar: { horizontal: true, borderRadius: 5, barHeight: '42%' } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: topContributorRows.map((row) => row.nama),
        labels: { style: { colors: '#6b7280', fontSize: '11px' } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: { labels: { style: { colors: '#4b5563', fontSize: '11px' }, maxWidth: 160 } },
      grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
      tooltip: { y: { formatter: (value) => (isWeightEnabled ? `${formatScore(Number(value))} score` : `${value} points`) } },
    }),
    [isWeightEnabled, topContributorRows],
  );

  if (isLoading) {
    return (
      <>
        <Title title='Dashboard Assignment' items={breadcrumbItems} />
        <DashboardSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Title title='Dashboard Assignment' items={breadcrumbItems} />
        <ErrorMessage message='Tidak dapat memuat dashboard assignment.' />
      </>
    );
  }

  if (!data || data.groups.length === 0 || data.assignments.length === 0) {
    return (
      <>
        <Title title='Dashboard Assignment' items={breadcrumbItems} />
        <NoData message='Belum ada data Study Group atau assignment untuk dashboard ini.' />
      </>
    );
  }

  return (
    <>
      <Title title='Dashboard Assignment' items={breadcrumbItems} />

      <div className='space-y-6'>
        <div className='flex flex-wrap items-center justify-between gap-4 rounded-xl border border-accent bg-white p-4 shadow-sm'>
          <Tabs value={mode} onValueChange={(value) => setMode(value as DashboardMode)}>
            <TabsList variant='line' className='gap-4'>
              <TabsTrigger value='all' className='text-xs md:text-sm'>
                Seluruh Kelompok
              </TabsTrigger>
              <TabsTrigger value='group' className='text-xs md:text-sm'>
                Per Kelompok
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='flex w-full flex-wrap items-center gap-3 sm:w-auto'>
            <Button type='button' variant='secondary' className='border bg-white text-xs text-primary shadow-sm hover:bg-secondary md:text-sm' onClick={handleOpenWeightDialog}>
              <Settings2 className='size-4' />
              Atur Bobot
            </Button>

            {mode === 'group' && (
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger className='w-full border-accent text-xs md:w-56 md:text-sm'>
                  <SelectValue placeholder='Pilih Study Group' />
                </SelectTrigger>
                <SelectContent className='border-accent'>
                  {data.groups.map((group) => (
                    <SelectItem key={group.id} value={group.id} className='text-xs md:text-sm'>
                      {group.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedAssignmentId} onValueChange={setSelectedAssignmentId}>
              <SelectTrigger className='w-full border-accent text-xs md:w-64 md:text-sm'>
                <SelectValue placeholder='Pilih Assignment' />
              </SelectTrigger>
              <SelectContent className='border-accent'>
                <SelectItem value={ALL_ASSIGNMENTS} className='text-xs md:text-sm'>
                  Semua Assignment
                </SelectItem>
                {data.assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id} className='text-xs md:text-sm'>
                    {formatAssignmentLabel(assignment)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Search value={studentSearch} onChange={setStudentSearch} placeholder='Search mahasiswa...' className='w-full sm:w-60' inputClassName='bg-white' showButton={false} />
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${isWeightEnabled ? 'xl:grid-cols-5' : 'xl:grid-cols-4'}`}>
          <SummaryCard title='Total Points' value={`${summary.totalPoints}`} description='Akumulasi kontribusi pada filter saat ini.' icon={Activity} />
          {isWeightEnabled && <SummaryCard title='Weighted Score' value={formatScore(summary.totalWeightedScore)} description='Simulasi score berdasarkan bobot assignment.' icon={Percent} />}
          <SummaryCard
            title='Mahasiswa Paling Dominan'
            value={summary.topContributor?.nama ?? '-'}
            description={summary.topContributor ? (isWeightEnabled ? `${formatScore(summary.topContributor.weightedScore)} weighted score` : `${summary.topContributor.totalPoints} points`) : 'Belum ada kontribusi.'}
            icon={UserRoundCheck}
          />
          <SummaryCard
            title='Assignment Paling Timpang'
            value={summary.assignmentPalingTimpang ? formatPercent(summary.assignmentPalingTimpang.dominancePercentage) : '-'}
            description={summary.assignmentPalingTimpang ? `${summary.assignmentPalingTimpang.judul} oleh ${summary.assignmentPalingTimpang.studentName}` : 'Belum ada assignment aktif.'}
            icon={TriangleAlert}
          />
          <SummaryCard title='Belum Berkontribusi' value={`${summary.inactiveStudents}`} description='Mahasiswa dengan 0 points pada filter saat ini.' icon={BarChart3} />
        </div>

        <Card className='border-accent bg-white shadow-sm'>
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <CardTitle className='text-sm font-bold text-primary md:text-base'>Matrix Kontribusi Per Assignment</CardTitle>
              <span className='text-xs text-accent'>
                Menampilkan {visibleRows.length} dari {rows.length} mahasiswa
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {visibleRows.length === 0 ? (
              <NoData message='Tidak ada mahasiswa pada filter ini.' />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='min-w-52 text-xs font-semibold text-primary md:text-sm'>Mahasiswa</TableHead>
                    {mode === 'all' && <TableHead className='min-w-44 text-xs font-semibold text-primary md:text-sm'>Study Group</TableHead>}
                    {assignments.map((assignment) => (
                      <TableHead key={assignment.id} className='min-w-44 text-xs font-semibold text-primary md:text-sm'>
                        {formatAssignmentLabel(assignment)}
                      </TableHead>
                    ))}
                    <TableHead className='text-xs font-semibold text-primary md:text-sm'>Total</TableHead>
                    {isWeightEnabled && <TableHead className='min-w-36 text-xs font-semibold text-primary md:text-sm'>Score Berbobot</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className='font-medium text-primary'>
                        <div className='flex flex-col'>
                          <span className='text-xs font-bold md:text-sm'>{row.nama}</span>
                          <span className='text-xs text-accent'>{row.nrp}</span>
                        </div>
                      </TableCell>
                      {mode === 'all' && <TableCell className='text-xs text-black/50 md:text-sm'>{row.groupName}</TableCell>}
                      {assignments.map((assignment) => {
                        const points = row.pointsByAssignment[assignment.id] ?? 0;
                        return (
                          <TableCell key={assignment.id} className='text-xs font-semibold text-primary md:text-sm' style={{ backgroundColor: getCellBackground(points, maxCellPoints) }}>
                            {points}
                          </TableCell>
                        );
                      })}
                      <TableCell className='text-xs font-bold text-primary md:text-sm'>{row.totalPoints}</TableCell>
                      {isWeightEnabled && <TableCell className='text-xs font-bold text-primary md:text-sm'>{formatScore(row.weightedScore)}</TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]'>
          <Card className='border-accent bg-white shadow-sm'>
            <CardHeader>
              <div className='flex flex-wrap items-center justify-between gap-2'>
                <CardTitle className='text-sm font-bold text-primary md:text-base'>Heatmap Kontribusi</CardTitle>
                {visibleRows.length > 16 && <span className='text-xs text-accent'>Scroll untuk melihat semua mahasiswa</span>}
              </div>
            </CardHeader>
            <CardContent>
              <div className='max-h-[560px] overflow-y-auto pr-2'>
                <ReactApexChart type='heatmap' series={heatmapSeries} options={heatmapOptions} height={heatmapHeight} />
              </div>
            </CardContent>
          </Card>

          <Card className='border-accent bg-white shadow-sm'>
            <CardHeader>
              <CardTitle className='text-sm font-bold text-primary md:text-base'>{isWeightEnabled ? 'Top Contributor Berbobot' : 'Top Contributor'}</CardTitle>
            </CardHeader>
            <CardContent>{visibleRows.length === 0 ? <NoData message='Belum ada kontributor.' /> : <ReactApexChart type='bar' series={topContributorSeries} options={topContributorOptions} height={320} />}</CardContent>
          </Card>
        </div>
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
        onReset={handleResetWeights}
        onSave={handleSaveWeights}
      />
    </>
  );
};

export default StudyGroupAssignmentDashboardPage;
