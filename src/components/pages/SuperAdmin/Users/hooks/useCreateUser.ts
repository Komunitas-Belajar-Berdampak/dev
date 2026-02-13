import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../services/users.service";
import type { CreateUserPayload } from "../types/user";

export function useCreateUser() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: CreateUserPayload) => UsersService.createUser(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return useMemo(
    () => ({
      createUser: mutation.mutateAsync,
      loading: mutation.isPending,
      error: mutation.error
        ? (mutation.error as any)?.response?.data?.message ??
          (mutation.error as any)?.message ??
          "Failed to create user"
        : null,
    }),
    [mutation.mutateAsync, mutation.isPending, mutation.error],
  );
}
