import { useEffect, useMemo, useState } from "react";
import type { DosenCourse } from "../types";
import { MatakuliahService } from "@/components/pages/SuperAdmin/Matakuliah/services/matakuliah.service";

type UseCoursesState = {
  data: DosenCourse[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function mapToDosenCourse(raw: any): DosenCourse {
  return {
    id: raw.id,
    kodeMatkul: raw.kodeMatkul,
    namaMatkul: raw.namaMatkul,
    sks: Number(raw.sks),
    status: raw.status,
    periode: raw.periode,
    deskripsi: raw.deskripsi ?? "",
    pengajar: raw.pengajar,
    kelas: raw.kelas,
  };
}

export function useCourses(): UseCoursesState {
  const [data, setData] = useState<DosenCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const list = await MatakuliahService.getMatakuliah();
      setData(list.map(mapToDosenCourse));
    } catch (e: any) {
      setData([]);
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Gagal mengambil data courses."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetcher();
  }, []);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetcher }),
    [data, isLoading, error]
  );
}
