import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  TahunAkademikDanSemesterService,
  type CreateAcademicTermPayload,
} from "../services/tahun-akademik-dan-semester.service";

export function useCreateTahunAkademikDanSemester() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: (payload: CreateAcademicTermPayload) =>
      TahunAkademikDanSemesterService.create(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["academic-terms"] });
    },
  });

  return useMemo(
    () => ({
      createAcademicTerm: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal menambah tahun akademik & semester"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}
