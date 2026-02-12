import EditPostContent from '@/components/pages/Dosen/StudyGroup/EditPost/components/EditPostContent';
import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';

const EditPostMhs = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaTopik, idTopik, idPost } = useParams();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/mahasiswa/study-groups' },
    { label: String(namaMatkul), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaTopik), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}/${namaTopik}/${idTopik}` },
    { label: 'Edit Discussion' },
  ];

  return (
    <>
      <Title title='Edit Discussion' items={breadcrumbItems} />
      <EditPostContent idPost={`${idPost}`} idTopik={`${idTopik}`} />
    </>
  );
};

export default EditPostMhs;
