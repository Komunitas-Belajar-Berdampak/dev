import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { TahunAkademikDanSemesterService } from "../../TahunAkademikDanSemester/services/tahun-akademik-dan-semester.service";
import type { TahunAkademikDanSemesterEntity } from "../../TahunAkademikDanSemester/types/tahun-akademik-dan-semester";

export function useAcademicTermsOptions() {
  const q = useQuery({
    queryKey: ["academic-terms"],
    queryFn: () => TahunAkademikDanSemesterService.getAll(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const terms = (q.data ?? []) as TahunAkademikDanSemesterEntity[];

  const options = useMemo(
    () =>
      terms.map((t: any) => ({
        id: String(t.id ?? t._id ?? ""),
        label: String(t.periode ?? "-"),
        status: String(t.status ?? ""),
      })).filter((x) => x.id && x.label !== "-"),
    [terms],
  );

  return useMemo(
    () => ({
      terms,
      options,
      loading: q.isLoading,
      error: q.error
        ? (q.error as any)?.response?.data?.message ??
          (q.error as any)?.message ??
          "Gagal memuat tahun akademik & semester"
        : null,
    }),
    [terms, options, q.isLoading, q.error],
  );
}
