import AddPostContent from '@/components/pages/Dosen/StudyGroup/AddPost/components/AddPostContent';
import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';

const AddPostMhs = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaTopik, idTopik } = useParams();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/mahasiswa/study-groups' },
    { label: String(namaMatkul), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaTopik), href: `/mahasiswa/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}/${namaTopik}/${idTopik}` },
    { label: 'New Discussion' },
  ];

  return (
    <>
      <Title title='New Discussion' items={breadcrumbItems} />
      <AddPostContent idTopik={`${idTopik}`} />
    </>
  );
};

export default AddPostMhs;
