import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { UsersService } from "../services/users.service";
import type { PatchUserPayload } from "../types/user";

export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (payload: PatchUserPayload) => UsersService.patchMe(payload),
  });

  return useMemo(
    () => ({
      changePassword: mutation.mutateAsync,
      loading: mutation.isPending,
      error: mutation.error
        ? (mutation.error as any)?.response?.data?.message ??
          (mutation.error as any)?.message ??
          "Failed to change password"
        : null,
    }),
    [mutation.mutateAsync, mutation.isPending, mutation.error],
  );
}