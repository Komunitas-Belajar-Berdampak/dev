import Title from '@/components/shared/Title';
import { useParams } from 'react-router-dom';
import AddPostContent from './components/AddPostContent';

const AddPost = () => {
  const { namaMatkul, idMatkul, namaSg, idSg, namaTopik, idTopik } = useParams();

  const breadcrumbItems = [
    { label: 'Study Groups', href: '/dosen/study-groups' },
    { label: String(namaMatkul), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}` },
    { label: String(namaSg), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}` },
    { label: String(namaTopik), href: `/dosen/study-groups/${namaMatkul}/${idMatkul}/${namaSg}/${idSg}/${namaTopik}/${idTopik}` },
    { label: 'New Discussion' },
  ];

  return (
    <>
      <Title title='New Discussion' items={breadcrumbItems} />
      <AddPostContent idTopik={`${idTopik}`} />
    </>
  );
};

export default AddPost;
