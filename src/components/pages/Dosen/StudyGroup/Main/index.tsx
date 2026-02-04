import Title from '@/components/shared/Title';
import StudyGroupMainContent from './components/StudyGroupMainContent';

const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }];

const StudyGroupMain = () => {
  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <StudyGroupMainContent />
    </>
  );
};

export default StudyGroupMain;
