import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import TopikPembahasanDetailContent from './components/TopikDetailContent';

const TopikPembahasanDetailMhs = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaTopik, idTopik } = useParams();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/mahasiswa/study-groups' },
    { label: String(namaMatkul), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaTopik) },
  ];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />
      <TopikPembahasanDetailContent idTopik={`${idTopik}`} namaTopik={`${namaTopik}`} idSg={`${idSg}`} />
    </>
  );
};
export default TopikPembahasanDetailMhs;
