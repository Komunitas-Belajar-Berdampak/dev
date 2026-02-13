import { useEffect, useMemo, useState } from "react";
import { MatakuliahService } from "@/components/pages/SuperAdmin/Matakuliah/services/matakuliah.service";

export type DosenCourseDetail = {
  id: string;
  kodeMatkul: string;
  namaMatkul: string;
  sks: number;
  status: "aktif" | "nonaktif";
  periode: string;
  deskripsi: string;
  pengajar: string;
  kelas: string;
  pertemuan?: any[];
};

type UseMatakuliahDetailState = {
  data: DosenCourseDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

function normalizeDetail(raw: any): DosenCourseDetail {
  return {
    id: raw?.id ?? raw?._id ?? "",
    kodeMatkul: raw?.kodeMatkul ?? "",
    namaMatkul: raw?.namaMatkul ?? "",
    sks: Number(raw?.sks ?? 0),
    status: (raw?.status ?? "aktif") as "aktif" | "nonaktif",
    periode: raw?.periode ?? "-",
    deskripsi: raw?.deskripsi ?? "",
    pengajar: raw?.pengajar ?? "-",
    kelas: raw?.kelas ?? "-",
    pertemuan: Array.isArray(raw?.pertemuan) ? raw.pertemuan : [],
  };
}

export function useMatakuliahDetail(id?: string): UseMatakuliahDetailState {
  const [data, setData] = useState<DosenCourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetcher = async () => {
    if (!id) {
      setData(null);
      setError("ID matakuliah tidak ada di URL.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await MatakuliahService.getMatakuliahById(id); // GET /courses/:id
      setData(normalizeDetail(res));
    } catch (e: any) {
      setData(null);
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Gagal mengambil detail mata kuliah."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetcher();
  }, [id]);

  return useMemo(
    () => ({ data, isLoading, error, refetch: fetcher }),
    [data, isLoading, error]
  );
}
