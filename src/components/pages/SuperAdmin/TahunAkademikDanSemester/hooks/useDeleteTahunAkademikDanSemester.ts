import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../services/tahun-akademik-dan-semester.service";

function extractErrorMessage(err: unknown): string {
  const e = err as any;
  const data = e?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof e?.message === "string" && e.message.length > 0) return e.message;
  return "Gagal menghapus tahun akademik & semester";
}

export function useDeleteTahunAkademikDanSemester() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (id: string) => TahunAkademikDanSemesterService.deleteById(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["academic-terms"] });
    },
  });

  return useMemo(
    () => ({
      deleteAcademicTerm: m.mutateAsync,
      loading: m.isPending,
      error: m.error ? extractErrorMessage(m.error) : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}