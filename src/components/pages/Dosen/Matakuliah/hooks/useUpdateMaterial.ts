import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialService, type UpdateMaterialPayload } from "../services/material.service";

export function useUpdateMaterial() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { idMaterial: string; payload: UpdateMaterialPayload }) =>
      MaterialService.updateMaterial(vars.idMaterial, vars.payload),
    onSuccess: (_data, ctx: any) => {
      qc.invalidateQueries({ queryKey: ["materials-by-course", ctx?.idCourse] });
    },
  });
}