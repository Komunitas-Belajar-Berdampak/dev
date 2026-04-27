import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, Percent, TriangleAlert, UserRoundCheck, type LucideIcon } from 'lucide-react';
import { formatPercent, formatScore } from '../utils/formatters';
import type { AssignmentDominance, StudentContributionRow } from '../utils/types';

type SummaryData = {
  totalPoints: number;
  totalWeightedScore: number;
  topContributor: StudentContributionRow | null;
  inactiveStudents: number;
  assignmentPalingTimpang: AssignmentDominance | null;
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

const SummaryCards = ({ summary, isWeightEnabled }: { summary: SummaryData; isWeightEnabled: boolean }) => {
  return (
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
  );
};

export default SummaryCards;
