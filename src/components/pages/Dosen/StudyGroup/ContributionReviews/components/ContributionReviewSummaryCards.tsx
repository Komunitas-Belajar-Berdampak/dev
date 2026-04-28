import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, ClipboardCheck, FileQuestion, type LucideIcon } from 'lucide-react';
import type { ContributionReviewSummary } from '../utils/types';

type SummaryCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
};

const SummaryCard = ({ title, value, description, icon: Icon }: SummaryCardProps) => (
  <Card className='border-accent bg-white py-4 shadow-sm'>
    <CardContent className='flex items-center justify-between gap-4'>
      <div>
        <p className='text-xs text-accent'>{title}</p>
        <p className='text-xl font-bold text-primary md:text-2xl'>{value}</p>
        <p className='text-xs text-accent'>{description}</p>
      </div>
      <div className='rounded-xl border border-accent bg-secondary p-3'>
        <Icon className='size-5 text-primary' />
      </div>
    </CardContent>
  </Card>
);

type ContributionReviewSummaryCardsProps = {
  summary: ContributionReviewSummary;
};

const ContributionReviewSummaryCards = ({ summary }: ContributionReviewSummaryCardsProps) => (
  <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
    <SummaryCard title='Total Review' value={summary.total} description='Semua rekomendasi kontribusi.' icon={ClipboardCheck} />
    <SummaryCard title='Pending' value={summary.pending} description='Menunggu review dosen.' icon={FileQuestion} />
    <SummaryCard title='Reviewed' value={summary.reviewed} description='Sudah memiliki poin final.' icon={CheckCircle2} />
  </div>
);

export default ContributionReviewSummaryCards;
