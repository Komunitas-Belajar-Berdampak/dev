import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UsersService } from "../services/users.service";
import type { CreateUserPayload } from "../types/user";

export type ImportResult = {
  nrp: string;
  nama: string;
  status: "success" | "error";
  message?: string;
};

export function useImportUsers() {
  const qc = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);

  const importUsers = async (payloads: CreateUserPayload[]) => {
    setLoading(true);
    setResults(null);

    const settled: ImportResult[] = [];

    for (const payload of payloads) {
      try {
        await UsersService.createUser(payload);
        settled.push({ nrp: payload.nrp, nama: payload.nama, status: "success" });
      } catch (err: any) {
        const msg: string =
          err?.response?.data?.message ??
          err?.message ??
          "Gagal menambahkan user";
        settled.push({ nrp: payload.nrp, nama: payload.nama, status: "error", message: msg });
      }
    }

    setResults(settled);
    setLoading(false);

    await qc.invalidateQueries({ queryKey: ["users"] });
    await qc.refetchQueries({ queryKey: ["users"] });

    return settled;
  };

  const reset = () => setResults(null);

  return useMemo(
    () => ({ importUsers, loading, results, reset }),
    [loading, results],
  );
}