import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgramStudiService, type CreateProgramStudiPayload } from "../services/program-studi.service";

export function useCreateProgramStudi() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (payload: CreateProgramStudiPayload) =>
      ProgramStudiService.createProgramStudi(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["program-studi"] });
    },
  });

  return useMemo(
    () => ({
      createProgramStudi: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal menambah program studi"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
