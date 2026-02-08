import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ProgramStudiService, type UpdateProgramStudiPayload } from "../services/program-studi.service";

export function useUpdateProgramStudi() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (args: { id: string; payload: UpdateProgramStudiPayload }) =>
      ProgramStudiService.updateProgramStudi(args.id, args.payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["program-studi"] });
    },
  });

  return useMemo(
    () => ({
      updateProgramStudi: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal mengubah program studi"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
