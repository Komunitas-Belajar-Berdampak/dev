import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RolesService } from "../services/roles.service";

export function useRoles() {
  const q = useQuery({
    queryKey: ["roles"],
    queryFn: () => RolesService.getRoles(),
    staleTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return useMemo(
    () => ({
      roles: q.data ?? [],
      loading: q.isLoading,
      error: q.error
        ? (q.error as any)?.response?.data?.message ??
          (q.error as any)?.message ??
          "Failed to fetch roles"
        : null,
    }),
    [q.data, q.isLoading, q.error],
  );
}
