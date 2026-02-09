import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import TopikPembahasanDetailContent from './components/TopikDetailContent';

const TopikPembahasanDetail = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaTopik, idTopik } = useParams();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/dosen/study-groups' },
    { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaTopik) },
  ];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <TopikPembahasanDetailContent idTopik={`${idTopik}`} namaTopik={`${namaTopik}`} />
    </>
  );
};
export default TopikPembahasanDetail;
