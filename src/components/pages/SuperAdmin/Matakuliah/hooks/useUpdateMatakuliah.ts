import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService, type UpdateMatakuliahPayload } from "../services/matakuliah.service";

export function useUpdateMatakuliah() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (args: { id: string; payload: UpdateMatakuliahPayload }) =>
      MatakuliahService.updateMatakuliah(args.id, args.payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return useMemo(
    () => ({
      updateMatakuliah: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal update matakuliah"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
