import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import StudyGroupListContent from './components/StudyGroupListContent';

const StudyGroupList = () => {
  const { namaMatkul, idMatkul } = useParams<{ namaMatkul: string; idMatkul: string }>();

  const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }, { label: String(namaMatkul) }];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />

      <StudyGroupListContent namaMatkul={String(namaMatkul)} idMatkul={String(idMatkul)} />
    </>
  );
};

export default StudyGroupList;
