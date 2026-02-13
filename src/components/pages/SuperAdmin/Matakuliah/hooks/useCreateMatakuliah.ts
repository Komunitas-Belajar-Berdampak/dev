import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService, type CreateMatakuliahPayload } from "../services/matakuliah.service";

export function useCreateMatakuliah() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (payload: CreateMatakuliahPayload) => MatakuliahService.createMatakuliah(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return useMemo(
    () => ({
      createMatakuliah: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal menambah matakuliah"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
