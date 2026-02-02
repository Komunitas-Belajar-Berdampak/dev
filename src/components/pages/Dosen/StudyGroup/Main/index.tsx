import Title from '@/components/shared/Title';
import StudyGroupMainContent from './StudyGroupMainContent';

const breadcrumbItems = [{ label: 'Study Groups', href: '/study-groups' }];

const StudyGroupMain = () => {
  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <StudyGroupMainContent />
    </>
  );
};

export default StudyGroupMain;
