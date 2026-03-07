import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";

export function useAddMahasiswaToMatkul(courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newMahasiswaIds: string[]) => {
      if (!courseId) throw new Error("Course ID tidak ditemukan");

      // Ambil data course dari cache, gabung dengan yang baru
      const cached: any = queryClient.getQueryData(["course", courseId]);
      const current: any[] = Array.isArray(cached?.mahasiswa) ? cached.mahasiswa : [];

      const existingIds = current
        .map((m: any) => String(m?.id ?? m?._id ?? "").trim())
        .filter(Boolean);

      // Merge, hindari duplikat
      const updatedIds = Array.from(new Set([...existingIds, ...newMahasiswaIds]));

      return MatakuliahService.updateMatakuliah(courseId, { idMahasiswa: updatedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },
  });
}