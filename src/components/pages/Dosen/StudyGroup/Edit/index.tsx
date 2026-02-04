import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import EditStudyGroupContent from './components/EditStudyGroupContent';

const EditStudyGroup = () => {
  const { namaMatkul, idMatkul, namaSg, idSg } = useParams<{ namaMatkul: string; idMatkul: string; namaSg: string; idSg: string }>();

  const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }, { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` }, { label: `Edit Study Group (${namaSg})` }];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />

      <EditStudyGroupContent namaMatkul={String(namaMatkul)} idMatkul={String(idMatkul)} namaSg={String(namaSg)} idSg={String(idSg)} />
    </>
  );
};
export default EditStudyGroup;
