import type { DosenCourseDetail } from "@/components/pages/Dosen/Matakuliah/hooks/useMatakuliahDetail";
import { MatakuliahService } from "@/components/pages/SuperAdmin/Matakuliah/services/matakuliah.service";
import { useQuery } from "@tanstack/react-query";

export type CourseMember = {
  id: string;
  nama: string;
  nrp: string;
  namaRole: string;
};

type DetailWithMembers = DosenCourseDetail & {
  pengajarList: CourseMember[];
  mahasiswaList: CourseMember[];
};

function normalizeMember(raw: any): CourseMember | null {
  if (raw == null || typeof raw === "string") return null;
  const id = String(raw.id ?? raw._id ?? "");
  const nrp = String(raw.nrp ?? raw.nim ?? "");
  if (!id || !nrp) return null;
  return {
    id,
    nama: String(raw.nama ?? raw.name ?? "-"),
    nrp,
    namaRole: String(raw.namaRole ?? raw.role ?? "-"),
  };
}

function normalizeDetail(raw: any): DetailWithMembers {
  const pengajarRaw = Array.isArray(raw?.pengajar) ? raw.pengajar : [];
  const mahasiswaRaw = Array.isArray(raw?.mahasiswa) ? raw.mahasiswa
    : Array.isArray(raw?.idMahasiswa) ? raw.idMahasiswa
    : [];

  return {
    id: raw?.id ?? raw?._id ?? "",
    kodeMatkul: raw?.kodeMatkul ?? "",
    namaMatkul: raw?.namaMatkul ?? "",
    sks: Number(raw?.sks ?? 0),
    status: (raw?.status ?? "aktif") as "aktif" | "nonaktif",
    periode: raw?.periode ?? "-",
    deskripsi: raw?.deskripsi ?? "",
    pengajar: Array.isArray(raw?.pengajar)
      ? raw.pengajar.map((p: any) => p?.nama ?? p).join(", ")
      : raw?.pengajar ?? "-",
    kelas: raw?.kelas ?? "-",
    pertemuan: Array.isArray(raw?.pertemuan) ? raw.pertemuan : [],
    pengajarList: pengajarRaw.map(normalizeMember).filter(Boolean) as CourseMember[],
    mahasiswaList: mahasiswaRaw.map(normalizeMember).filter(Boolean) as CourseMember[],
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
