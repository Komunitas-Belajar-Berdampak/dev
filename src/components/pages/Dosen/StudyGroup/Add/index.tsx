import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import AddStudyGroupContent from './components/AddStudyGroupContent';

const AddStudyGroup = () => {
  const { namaMatkul, idMatkul } = useParams<{ namaMatkul: string; idMatkul: string }>();

  const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }, { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` }, { label: 'Add Study Group' }];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />

      <AddStudyGroupContent namaMatkul={String(namaMatkul)} idMatkul={String(idMatkul)} />
    </>
  );
};
export default AddStudyGroup;
