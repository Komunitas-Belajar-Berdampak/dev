import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { TahunAkademikDanSemesterEntity } from "../types/tahun-akademik-dan-semester";
import { useUpsertSemester } from "../hooks/useUpsertSemester";

function normalizeSemesters(list: number[]) {
  const uniq = Array.from(
    new Set(list.filter((n) => Number.isFinite(n) && n > 0)),
  );
  uniq.sort((a, b) => a - b);
  return uniq;
}

export default function AddSemesterModal({
  open,
  onClose,
  term,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  term: TahunAkademikDanSemesterEntity;
  onSuccess?: () => void;
}) {
  const { upsertSemesters, loading, error } = useUpsertSemester();

  const [value, setValue] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const semesterNumber = useMemo(() => Number(value), [value]);
  const existing = useMemo(() => normalizeSemesters(term.semesters ?? []), [term.semesters]);

  const invalid = useMemo(() => {
    if (!value.trim()) return true;
    if (!Number.isFinite(semesterNumber) || semesterNumber <= 0) return true;
    if (existing.includes(semesterNumber)) return true;
    return false;
  }, [value, semesterNumber, existing]);

  const submit = async () => {
    setLocalError(null);

    if (!value.trim()) return setLocalError("Semester wajib diisi.");
    if (!Number.isFinite(semesterNumber) || semesterNumber <= 0)
      return setLocalError("Semester harus angka > 0.");
    if (existing.includes(semesterNumber))
      return setLocalError("Semester tersebut sudah ada.");

    const next = normalizeSemesters([...existing, semesterNumber]);

    try {
      await upsertSemesters({ term, semesters: next });
      setValue("");
      onSuccess?.();
      onClose();
    } catch {
      // error ditampilkan dari hook
    }
  };

  const combinedError = localError ?? error ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setLocalError(null);
          setValue("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Semester</DialogTitle>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        <div className="space-y-3 mt-4">
          <Input
            placeholder="Contoh: 7"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <div className="text-xs text-muted-foreground">
            Semester existing:{" "}
            {existing.length ? existing.join(", ") : "belum ada"}
          </div>

          <Button
            className="w-full border-2 border-black shadow-[3px_3px_0_0_#000]"
            onClick={submit}
            disabled={loading || invalid}
          >
            {loading ? "Menyimpan..." : "Tambah"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}