import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../services/tahun-akademik-dan-semester.service";
import type { TahunAkademikDanSemesterEntity } from "../types/tahun-akademik-dan-semester";

function extractErrorMessage(err: unknown): string {
  const e = err as any;
  const data = e?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof e?.message === "string" && e.message.length > 0) return e.message;
  return "Gagal menambah semester";
}

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
      error: m.error ? extractErrorMessage(m.error) : null,
    }),
    [m.mutateAsync, m.isPending, m.error],
  );
}