import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgramStudiService } from "../services/program-studi.service";
import type { ProgramStudiEntity } from "../types/program-studi";

export function useProgramStudi() {
  const query = useQuery({
    queryKey: ["program-studi"],
    queryFn: () => ProgramStudiService.getProgramStudi(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const programStudi = (query.data ?? []) as ProgramStudiEntity[];

  return useMemo(
    () => ({
      programStudi,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Gagal mengambil data program studi"
        : null,
      refetch: query.refetch,
      isFetching: query.isFetching,
    }),
    [programStudi, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}
