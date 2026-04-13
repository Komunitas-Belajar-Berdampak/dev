import Title from '@/components/shared/Title';
import type { UserProfile } from '@/types/profile';
import { useParams } from 'react-router-dom';
import ProfileContent from './components/ProfileContent';
import PublicFiles from './components/PublicFiles';
import { useFetchProfile } from './hooks/useFetchProfile';

const ProfilePage = () => {
  const breadcrumbItems = [
    {
      label: 'Profile',
      href: '/profile',
    },
  ];
  const { id } = useParams();
  const { data, isPending } = useFetchProfile(id);
  return (
    <section
      className=' w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8'
    >
      <Title title='Profile' items={breadcrumbItems} />
      <ProfileContent isEditing={false} data={data as UserProfile} isPending={isPending} />
      <PublicFiles id={data?.id as string} />
    </section>
  );
};

export default ProfilePage;
