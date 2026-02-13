import { useQuery } from "@tanstack/react-query";
import { RolesService, type RoleEntity } from "../services/roles.service";

export function useRoles() {
  const q = useQuery({
    queryKey: ["roles"],
    queryFn: () => RolesService.getRoles(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    roles: (q.data ?? []) as RoleEntity[],
    loading: q.isLoading,
    error: q.error
      ? (q.error as any)?.response?.data?.message ??
        (q.error as any)?.message ??
        "Failed to load roles"
      : null,
  };
}
