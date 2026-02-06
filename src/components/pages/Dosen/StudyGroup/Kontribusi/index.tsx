import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import KontribusiMahasiswaDetailContent from './components/KontribusiContent';

const KontribusiMahasiswaDetail = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaAnggota, idAnggota } = useParams<{ namaMatkul: string; idMatkul: string; namaSg: string; idSg: string; namaAnggota: string; idAnggota: string }>();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/dosen/study-groups' },
    { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaAnggota) },
  ];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />

      <KontribusiMahasiswaDetailContent idStudyGroup={`${idSg}`} namaAnggota={`${namaAnggota}`} idAnggota={`${idAnggota}`} />
    </>
  );
};

export default KontribusiMahasiswaDetail;
