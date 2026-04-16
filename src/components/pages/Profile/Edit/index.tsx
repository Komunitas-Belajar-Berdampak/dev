import Title from '@/components/shared/Title';
import type { UserProfile } from '@/types/profile';
import { useParams } from 'react-router-dom';
import ProfileContent from '../components/ProfileContent';
import { useFetchProfile } from '../hooks/useFetchProfile';

const EditProfilePage = () => {
  const breadcrumbItems = [
    {
      label: 'Profile',
      href: '/profile',
    },
    {
      label: 'Edit Profile',
      href: '/profile/edit',
    },
  ];
  const { id } = useParams();
  const { data, isPending } = useFetchProfile(id);

  return (
    <section
      className='w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8'
    >
      <Title title='Edit Profile' items={breadcrumbItems} />
      <ProfileContent isEditing={true} data={data as UserProfile} isPending={isPending} />
    </section>
  );
};

export default EditProfilePage;
