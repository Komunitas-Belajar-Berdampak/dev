import type { DosenCourseDetail } from "@/components/pages/Dosen/Matakuliah/hooks/useMatakuliahDetail";
import { MatakuliahService } from "@/components/pages/SuperAdmin/Matakuliah/services/matakuliah.service";
import { useQuery } from "@tanstack/react-query";

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

export function useDetailCourses(id?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["course-detail", id],
    queryFn: async () => {
      const res = await MatakuliahService.getMatakuliahById(id!);
      return normalizeDetail(res);
    },
    enabled: !!id,
  });

  return {
    data: data ?? null,
    isLoading,
    error: error
      ? ((error as any)?.response?.data?.message ?? error.message)
      : null,
    refetch,
  };
}
