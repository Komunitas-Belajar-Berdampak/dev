import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialService, type CreateMaterialPayload } from "../services/material.service";

export function useCreateMaterial() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (vars: {
      idCourse: string;
      pertemuan: number;
      payload: CreateMaterialPayload;
    }) => {
      return MaterialService.createMaterialByCourseMeeting(
        vars.idCourse,
        vars.pertemuan,
        vars.payload
      );
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["materials-by-course", vars.idCourse] });
    },
  });
}