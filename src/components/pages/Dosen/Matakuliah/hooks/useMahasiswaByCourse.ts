import { useQuery } from "@tanstack/react-query";
import { MatakuliahService } from "@/components/pages/SuperAdmin/Matakuliah/services/matakuliah.service";

export type MahasiswaCourseItem = {
  id: string;
  nama: string;
  nim?: string;
  nrp?: string;
};

function normalizeMahasiswa(raw: any): MahasiswaCourseItem[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw?.idMahasiswa)
      ? raw.idMahasiswa
      : Array.isArray(raw?.mahasiswa)
        ? raw.mahasiswa
        : [];

  return list
    .map((it: any) => {
      if (it == null) return null;

      if (typeof it === "string") {
        return { id: it, nama: "-" } as MahasiswaCourseItem;
      }

      const id = String(it.id ?? it._id ?? it.userId ?? it.mahasiswaId ?? "");
      const nama = String(it.nama ?? it.name ?? it.fullName ?? "-");
      const nim = it.nim ?? it.nrp ?? it.nimMahasiswa ?? it.studentId;
      const nrp = it.nrp ?? it.nim;

      if (!id) return null;

      return {
        id,
        nama,
        nim: nim ? String(nim) : undefined,
        nrp: nrp ? String(nrp) : undefined,
      } as MahasiswaCourseItem;
    })
    .filter(Boolean) as MahasiswaCourseItem[];
}

export function useMahasiswaByCourse(courseId?: string) {
  return useQuery({
    queryKey: ["course-mahasiswa", courseId],
    enabled: Boolean(courseId),
    queryFn: async () => {
      const course: any = await MatakuliahService.getMatakuliahById(String(courseId));
      const raw = course?.idMahasiswa ?? course?.mahasiswa ?? [];
      return normalizeMahasiswa(raw);
    },
  });
}
