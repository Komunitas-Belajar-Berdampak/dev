import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MatakuliahService } from "../services/matakuliah.service";

function extractErrorMessage(err: unknown): string {
  const e = err as any;
  const data = e?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof e?.message === "string" && e.message.length > 0) return e.message;
  return "Gagal menghapus matakuliah";
}

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
      error: m.error ? extractErrorMessage(m.error) : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}