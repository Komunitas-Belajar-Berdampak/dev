import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../services/users.service";
import type { UserEntity } from "../types/user";

export function useUsers() {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: () => UsersService.getUsers(),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const users = (query.data ?? []) as UserEntity[];

  return useMemo(
    () => ({
      users,
      loading: query.isLoading,
      error: query.error
        ? (query.error as any)?.response?.data?.message ??
          (query.error as any)?.message ??
          "Failed to fetch users"
        : null,
      refetch: () => query.refetch(),
      isFetching: query.isFetching,
    }),
    [users, query.isLoading, query.error, query.refetch, query.isFetching],
  );
}
