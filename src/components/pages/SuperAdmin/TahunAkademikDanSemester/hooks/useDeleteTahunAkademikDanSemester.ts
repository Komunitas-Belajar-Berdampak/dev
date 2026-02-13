import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../services/tahun-akademik-dan-semester.service";

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
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal menghapus tahun akademik & semester"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
