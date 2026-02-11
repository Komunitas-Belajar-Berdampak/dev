import Title from '@/components/shared/Title';
import StudyGroupMainContent from './components/MainContent';

const StudyGroupMainMhs = () => {
  const breadcrumbItems = [{ label: 'Study Groups' }];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <StudyGroupMainContent />
    </>
  );
};

export default StudyGroupMainMhs;
