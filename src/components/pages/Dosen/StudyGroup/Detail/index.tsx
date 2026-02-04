import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import StudyGroupDetailContent from './components/StudyGroupDetailContent';

const StudyGroupDetail = () => {
  const { namaMatkul, idMatkul, namaSg, idSg } = useParams<{ namaMatkul: string; idMatkul: string; namaSg: string; idSg: string }>();

  const breadcrumbItems = [{ label: 'Study Groups', href: '/dosen/study-groups' }, { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` }, { label: String(namaSg) }];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <StudyGroupDetailContent idSg={String(idSg)} namaSg={String(namaSg)} />
    </>
  );
};

export default StudyGroupDetail;
