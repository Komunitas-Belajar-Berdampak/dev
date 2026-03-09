import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export type NilaiMahasiswaItem = {
  id: string;
  judul: string;
  nilai: number | null;
  maxNilai: number;
  submittedAt: string | null;
};

async function fetchNilaiMahasiswa(
  idCourse: string,
  idMahasiswa: string
): Promise<NilaiMahasiswaItem[]> {
  const res = await api.get<any>(`/submissions/course/${idCourse}/mahasiswa/${idMahasiswa}`);
  const payload = res.data?.data ?? res.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

export function useSubmissionsByMahasiswa(idCourse?: string, idMahasiswa?: string) {
  return useQuery({
    queryKey: ["submissions-mahasiswa", idCourse, idMahasiswa],
    queryFn: () => fetchNilaiMahasiswa(idCourse as string, idMahasiswa as string),
    enabled: Boolean(idCourse) && Boolean(idMahasiswa),
  });
}