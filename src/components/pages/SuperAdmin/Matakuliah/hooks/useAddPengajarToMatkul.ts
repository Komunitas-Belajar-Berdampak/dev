import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";

export function useAddPengajarToMatkul(courseId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dosenIds: string[]) => {
      if (!courseId) throw new Error("Course ID tidak ditemukan");
      return MatakuliahService.addPengajarToCourse(courseId, dosenIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });
    },
  });
}