import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";

export function useDeleteMahasiswaFromMatkul(courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mahasiswaId: string) => {
      if (!courseId) throw new Error("Course ID tidak ditemukan");

      // Ambil data course dari cache (sudah di-fetch sebelumnya, tidak perlu GET lagi)
      const cached: any = queryClient.getQueryData(["course", courseId]);
      const current: any[] = Array.isArray(cached?.mahasiswa) ? cached.mahasiswa : [];

      // Filter out mahasiswa yang dihapus, kirim hanya array of id
      const updatedIds = current
        .map((m: any) => String(m?.id ?? m?._id ?? "").trim())
        .filter((id) => id && id !== mahasiswaId);

      return MatakuliahService.updateMatakuliah(courseId, { idMahasiswa: updatedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },
  });
}