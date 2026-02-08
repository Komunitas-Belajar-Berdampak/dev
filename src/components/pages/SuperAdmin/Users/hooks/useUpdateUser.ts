import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../services/users.service";
import type { UpdateUserPayload } from "../types/user";

export function useUpdateUser() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      UsersService.updateUser(id, payload),
    onSuccess: async (_, vars) => {
      // refresh list
      await qc.invalidateQueries({ queryKey: ["users"] });
      await qc.invalidateQueries({ queryKey: ["user", vars.id] });
    },
  });

  return useMemo(
    () => ({
      updateUser: mutation.mutateAsync,
      loading: mutation.isPending,
      error: mutation.error
        ? (mutation.error as any)?.response?.data?.message ??
          (mutation.error as any)?.message ??
          "Failed to update user"
        : null,
    }),
    [mutation.mutateAsync, mutation.isPending, mutation.error],
  );
}
