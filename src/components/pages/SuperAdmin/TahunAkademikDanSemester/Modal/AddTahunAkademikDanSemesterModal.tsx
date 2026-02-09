import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import type { StatusTahunAkademikBE } from "../types/tahun-akademik-dan-semester";
import { useCreateTahunAkademikDanSemester } from "../hooks/useCreateTahunAkademikDanSemester";

export default function AddTahunAkademikDanSemesterModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createAcademicTerm, loading, error } =
    useCreateTahunAkademikDanSemester();

  const [periode, setPeriode] = useState("");
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");     // YYYY-MM-DD
  const [status, setStatus] = useState<StatusTahunAkademikBE>("aktif");
  const [localError, setLocalError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return (
      loading ||
      !periode.trim() ||
      !startDate ||
      !endDate ||
      !status
    );
  }, [loading, periode, startDate, endDate, status]);

  const submit = async () => {
    setLocalError(null);

    const p = periode.trim();
    if (!p) return setLocalError("Periode wajib diisi.");
    if (!startDate) return setLocalError("Tanggal mulai wajib diisi.");
    if (!endDate) return setLocalError("Tanggal selesai wajib diisi.");

    // validasi sederhana: end >= start
    if (endDate < startDate) return setLocalError("Tanggal selesai harus >= tanggal mulai.");

    try {
      await createAcademicTerm({
        periode: p,
        startDate,
        endDate,
        status,
      });

      setPeriode("");
      setStartDate("");
      setEndDate("");
      setStatus("aktif");
      onSuccess?.();
      onClose();
    } catch {
      // error sudah dihandle hook
    }
  };

  const combinedError = localError ?? error ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setLocalError(null);
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tahun Akademik & Semester</DialogTitle>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Periode (contoh: 2025/2026 - Ganjil - Semester 7)"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          />

          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <Select value={status} onValueChange={(v) => setStatus(v as StatusTahunAkademikBE)}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
          {loading ? "Menyimpan..." : "Tambah Periode"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
