import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../services/tahun-akademik-dan-semester.service";
import type { TahunAkademikDanSemesterEntity } from "../types/tahun-akademik-dan-semester";

export function useUpsertSemester() {
  const qc = useQueryClient();

  const m = useMutation({
    mutationFn: async ({
      term,
      semesters,
    }: {
      term: TahunAkademikDanSemesterEntity;
      semesters: number[];
    }) => {
      const id = String((term as any)._id ?? term.id);
      return TahunAkademikDanSemesterService.update(id, {
        periode: term.periode,
        semesterType: term.semesterType,
        startDate: term.startDate,
        endDate: term.endDate,
        status: term.status,
        semesters,
      });
    },
    onSuccess: async (_, vars) => {
      const id = String((vars.term as any)._id ?? vars.term.id);
      await qc.invalidateQueries({ queryKey: ["academic-terms"] });
      await qc.invalidateQueries({ queryKey: ["academic-term-by-id", id] });
    },
  });

  return useMemo(
    () => ({
      upsertSemesters: m.mutateAsync,
      loading: m.isPending,
      error: m.error
        ? (m.error as any)?.response?.data?.message ??
          (m.error as any)?.message ??
          "Gagal menambah semester"
        : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}