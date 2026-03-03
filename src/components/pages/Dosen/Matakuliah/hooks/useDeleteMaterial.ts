import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialService } from "../services/material.service";

export function useDeleteMaterial(idCourse?: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (idMaterial: string) => MaterialService.deleteMaterial(idMaterial),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["materials-by-course", idCourse] });
    },
  });
}