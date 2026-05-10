import { getUserByNrp } from '@/api/profile';
import { Skeleton } from '@/components/ui/skeleton';
import { getUser } from '@/lib/authStorage';
import { useQuery } from '@tanstack/react-query';
import { Navigate, Outlet } from 'react-router-dom';

const VarkSurveyGuard = () => {
  const authUser = getUser();

  const { data, isPending } = useQuery({
    queryKey: ['profile', authUser?.nrp],
    queryFn: () => getUserByNrp(authUser!.nrp),
    enabled: !!authUser?.nrp,
  });

  if (isPending) {
    return (
      <div className='w-full max-w-3xl mx-auto space-y-4 pt-4'>
        <Skeleton className='h-8 w-64' />
        <Skeleton className='h-14 w-full' />
        <Skeleton className='h-32 w-full' />
        <Skeleton className='h-32 w-full' />
      </div>
    );
  }

  const profile = data?.data;
  const hasLearningApproach = profile?.gayaBelajar && profile.gayaBelajar.length > 0;

  if (!hasLearningApproach) {
    return <Navigate to='/survey' replace />;
  }

  return <Outlet />;
};

export default VarkSurveyGuard;
