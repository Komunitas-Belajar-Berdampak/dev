import { getStudyGroupMemberById } from '@/api/study-group';
import NoData from '@/components/shared/NoData';
import type { ApiResponse } from '@/types/api';
import type { StudyGroupMemberDetail } from '@/types/sg';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import KontribusiBody from './Body';
import KontribusiHeader from './Header';
import KontribusiMahasiswaDetailSkeleton from './KontribusiSkeleton';

type KontribusiMahasiswaDetailContentProps = {
  idStudyGroup: string;
  idAnggota: string;
  namaAnggota: string;
};

const KontribusiMahasiswaDetailContent = ({ idStudyGroup, idAnggota, namaAnggota }: KontribusiMahasiswaDetailContentProps) => {
  const { data, isLoading, isError, error, isFetching } = useQuery<ApiResponse<StudyGroupMemberDetail>, Error, StudyGroupMemberDetail>({
    queryKey: ['study-group-member-by-id', idStudyGroup, idAnggota],
    queryFn: () => getStudyGroupMemberById(idStudyGroup, idAnggota),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (!isError) return;
    console.error(error?.message || 'Gagal mengambil data kontribusi mahasiswa.');
  }, [error?.message, isError]);

  if (isLoading || isFetching) return <KontribusiMahasiswaDetailSkeleton />;
  if (isError) return <NoData message={error?.message || 'Gagal mengambil data kontribusi mahasiswa.'} />;
  if (!data) return <NoData message='Data kontribusi tidak ditemukan.' />;

  return (
    <>
      {/* header */}
      <KontribusiHeader namaAnggota={namaAnggota} data={data.kontribusiTotalByThread} totalKontribusi={data.totalKontribusi} />

      {/* body */}
      <KontribusiBody data={data} />
    </>
  );
};

export default KontribusiMahasiswaDetailContent;
