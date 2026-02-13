import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import EditPostContent from './components/EditPostContent';

const EditPost = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaTopik, idTopik, idPost } = useParams();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/dosen/study-groups' },
    { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaTopik), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}/${namaTopik}/${idTopik}` },
    { label: 'Edit Discussion' },
  ];

  return (
    <>
      <Title title='Edit Discussion' items={breadcrumbItems} />
      <EditPostContent idPost={`${idPost}`} idTopik={`${idTopik}`} />
    </>
  );
};

export default EditPost;
