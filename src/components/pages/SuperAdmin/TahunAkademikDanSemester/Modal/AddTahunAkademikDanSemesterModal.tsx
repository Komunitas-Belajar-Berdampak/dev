import { useEffect, useMemo, useState } from "react";
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
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import type { StatusTahunAkademikBE, SemesterType } from "../types/tahun-akademik-dan-semester";
import { useCreateTahunAkademikDanSemester } from "../hooks/useCreateTahunAkademikDanSemester";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

function extractErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof err?.message === "string" && err.message.length > 0) return err.message;
  return "Terjadi kesalahan saat menambahkan tahun akademik.";
}

function isDuplicateError(err: any, msg: string): boolean {
  const status = err?.response?.status;
  const msgLower = msg.toLowerCase();
  if (status === 409) return true;
  if (msgLower.includes("e11000")) return true;
  if (
    msgLower.includes("duplicate") ||
    msgLower.includes("already") ||
    msgLower.includes("sudah terdaftar") ||
    msgLower.includes("sudah ada")
  ) return true;
  const errData = err?.response?.data;
  if (errData?.keyPattern || errData?.keyValue || errData?.code === 11000) return true;
  return false;
}

export default function AddTahunAkademikDanSemesterModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createAcademicTerm, loading } = useCreateTahunAkademikDanSemester();

  const [periode, setPeriode] = useState("");
  const [semesterType, setSemesterType] = useState<SemesterType>("Ganjil");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState<StatusTahunAkademikBE>("aktif");

  useEffect(() => {
    if (!open) {
      setPeriode("");
      setSemesterType("Ganjil");
      setStartDate("");
      setEndDate("");
      setStatus("aktif");
    }
  }, [open]);

  const disabled = useMemo(
    () => loading || !periode.trim() || !startDate || !endDate || !semesterType || !status,
    [loading, periode, startDate, endDate, semesterType, status],
  );

  const submit = async () => {
    const p = periode.trim();

    if (!p) {
      toast.error("Periode Wajib Diisi!", {
        description: "Silakan isi periode sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!startDate) {
      toast.error("Tanggal Mulai Wajib Diisi!", {
        description: "Silakan pilih tanggal mulai periode.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!endDate) {
      toast.error("Tanggal Selesai Wajib Diisi!", {
        description: "Silakan pilih tanggal selesai periode.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (endDate < startDate) {
      toast.error("Tanggal Tidak Valid!", {
        description: "Tanggal selesai harus lebih besar atau sama dengan tanggal mulai.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await createAcademicTerm({ periode: p, semesterType, startDate, endDate, status });
      onSuccess?.();
      onClose();

      toast.success("Tahun Akademik Berhasil Ditambahkan!", {
        description: `Periode ${p} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menambahkan Tahun Akademik!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (isDuplicateError(err, msg)) {
        title = "Periode Sudah Terdaftar!";
        description = `Periode "${p}" sudah terdaftar di sistem. Gunakan periode yang berbeda.`;
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menambahkan tahun akademik.") {
        description = msg;
      }

      toast.error(title, {
        description,
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl w-[calc(100%-2rem)] sm:w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Add Tahun Akademik & Semester</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Periode (contoh: 2025/2026 - Ganjil - Semester 7)"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          />

          <Select value={semesterType} onValueChange={(v) => setSemesterType(v as SemesterType)}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Pilih Semester Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ganjil">Ganjil</SelectItem>
              <SelectItem value="Genap">Genap</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

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