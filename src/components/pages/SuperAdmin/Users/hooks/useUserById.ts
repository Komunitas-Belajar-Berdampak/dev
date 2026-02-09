import { useQuery } from "@tanstack/react-query";
import { UsersService } from "../services/users.service"; // sesuaikan path

export function useUserById(id: string | null, open: boolean) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => UsersService.getUserById(id as string),
    enabled: Boolean(open && id),
    staleTime: 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
