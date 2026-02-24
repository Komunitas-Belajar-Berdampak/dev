import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";

export function useDeletePengajarFromMatkul(courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dosenId: string) => {
      if (!courseId) throw new Error("Course ID tidak ditemukan");
      return MatakuliahService.deletePengajarFromCourse(courseId, dosenId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },
  });
}