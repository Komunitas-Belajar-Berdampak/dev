import KontribusiMahasiswaDetailContent from '@/components/pages/Dosen/StudyGroup/Kontribusi/components/KontribusiContent';
import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';

const KontribusiMahasiswaDetailMhs = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaAnggota, idAnggota } = useParams<{ namaMatkul: string; idMatkul: string; namaSg: string; idSg: string; namaAnggota: string; idAnggota: string }>();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/mahasiswa/study-groups' },
    { label: String(namaMatkul), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaAnggota) },
  ];

  return (
    <>
      <Title title='Study Groups' items={breadcrumbItems} />

      <KontribusiMahasiswaDetailContent idStudyGroup={`${idSg}`} namaAnggota={`${namaAnggota}`} idAnggota={`${idAnggota}`} />
    </>
  );
};

export default KontribusiMahasiswaDetailMhs;
