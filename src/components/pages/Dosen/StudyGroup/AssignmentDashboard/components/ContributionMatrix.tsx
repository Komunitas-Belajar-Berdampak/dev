import NoData from '@/components/shared/NoData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StudyGroupAssignmentDashboardAssignment } from '@/types/sg';
import { getCellBackground } from '../utils/dashboard-calculations';
import { formatAssignmentLabel, formatScore } from '../utils/formatters';
import type { DashboardMode, StudentContributionRow } from '../utils/types';

type ContributionMatrixProps = {
  mode: DashboardMode;
  assignments: StudyGroupAssignmentDashboardAssignment[];
  rows: StudentContributionRow[];
  visibleRows: StudentContributionRow[];
  maxCellPoints: number;
  isWeightEnabled: boolean;
};

const ContributionMatrix = ({ mode, assignments, rows, visibleRows, maxCellPoints, isWeightEnabled }: ContributionMatrixProps) => {
  return (
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
  );
};

export default ContributionMatrix;
