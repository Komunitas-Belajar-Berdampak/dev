import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import type { TahunAkademikDanSemesterEntity } from "../types/tahun-akademik-dan-semester";
import { useUpsertSemester } from "../hooks/useUpsertSemester";

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
  return "Terjadi kesalahan saat menambahkan semester.";
}

function normalizeSemesters(list: number[]) {
  const uniq = Array.from(new Set(list.filter((n) => Number.isFinite(n) && n > 0)));
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
  const { upsertSemesters, loading } = useUpsertSemester();

  const [value, setValue] = useState("");

  const semesterNumber = useMemo(() => Number(value), [value]);
  const existing = useMemo(() => normalizeSemesters(term.semesters ?? []), [term.semesters]);

  const invalid = useMemo(() => {
    if (!value.trim()) return true;
    if (!Number.isFinite(semesterNumber) || semesterNumber <= 0) return true;
    if (existing.includes(semesterNumber)) return true;
    return false;
  }, [value, semesterNumber, existing]);

  const submit = async () => {
    if (!value.trim()) {
      toast.error("Semester Wajib Diisi!", {
        description: "Silakan isi nomor semester sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!Number.isFinite(semesterNumber) || semesterNumber <= 0) {
      toast.error("Nomor Semester Tidak Valid!", {
        description: "Semester harus berupa angka lebih dari 0.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (existing.includes(semesterNumber)) {
      toast.error("Semester Sudah Ada!", {
        description: `Semester ${semesterNumber} sudah terdaftar dalam periode ini.`,
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    const next = normalizeSemesters([...existing, semesterNumber]);

    try {
      await upsertSemesters({ term, semesters: next });
      setValue("");
      onSuccess?.();
      onClose();

      toast.success("Semester Berhasil Ditambahkan!", {
        description: `Semester ${semesterNumber} berhasil ditambahkan ke periode ini.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menambahkan Semester!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menambahkan semester.") {
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setValue("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Tambah Semester</DialogTitle>
        </DialogHeader>

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