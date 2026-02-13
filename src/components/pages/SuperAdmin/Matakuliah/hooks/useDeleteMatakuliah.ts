import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";

export function useDeleteMatakuliah() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (id: string) => MatakuliahService.deleteMatakuliah(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return useMemo(
    () => ({
      deleteMatakuliah: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal menghapus matakuliah"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
