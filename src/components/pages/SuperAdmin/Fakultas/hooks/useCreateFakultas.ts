import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FakultasService } from "../services/fakultas.service";

export type CreateFakultasPayload = {
  kodeFakultas: string;
  namaFakultas: string;
};

export function useCreateFakultas() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateFakultasPayload) =>
      FakultasService.createFakultas({
        kodeFakultas: payload.kodeFakultas,
        namaFakultas: payload.namaFakultas,
        // optional: biar konsisten ke tipe entity
        prodi: [],
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["fakultas"] });
    },
  });

  return useMemo(
    () => ({
      createFakultas: mutation.mutateAsync,
      loading: mutation.isPending,
      error: mutation.error
        ? (mutation.error as any)?.response?.data?.message ??
          (mutation.error as any)?.message ??
          "Gagal menambah fakultas"
        : null,
    }),
    [mutation.mutateAsync, mutation.isPending, mutation.error],
  );
}
