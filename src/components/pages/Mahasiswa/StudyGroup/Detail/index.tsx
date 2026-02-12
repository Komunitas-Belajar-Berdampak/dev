import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import DetailContent from './components/DetailContent';

const StudyGroupDetailMhs = () => {
  const { namaMatkul, idMatkul, namaSg, idSg } = useParams();

  const breadcrumbItems = [{ label: 'Study Groups', href: '/mahasiswa/study-groups' }, { label: String(namaMatkul), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}` }, { label: String(namaSg) }];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <DetailContent idSg={String(idSg)} namaSg={String(namaSg)} idCourse={String(idMatkul)} />
    </>
  );
};

export default StudyGroupDetailMhs;
