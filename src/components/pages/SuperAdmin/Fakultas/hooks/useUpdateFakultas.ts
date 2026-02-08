import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FakultasService } from "../services/fakultas.service";
import type { UpdateFakultasPayload } from "../types/fakultas";

export function useUpdateFakultas() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (args: { id: string; payload: UpdateFakultasPayload }) => {
      return FakultasService.updateFakultas(args.id, args.payload);
    },
    onSuccess: async () => {
      // refresh list fakultas
      await qc.invalidateQueries({ queryKey: ["fakultas"] });
    },
  });

  return useMemo(
    () => ({
      updateFakultas: mutation.mutateAsync,
      loading: mutation.isPending,
      error: mutation.error
        ? (mutation.error as any)?.response?.data?.message ??
          (mutation.error as any)?.message ??
          "Gagal mengubah data fakultas"
        : null,
    }),
    [mutation.mutateAsync, mutation.isPending, mutation.error],
  );
}
