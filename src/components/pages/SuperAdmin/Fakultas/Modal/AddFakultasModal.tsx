import { useEffect, useMemo, useState } from "react";
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

import { useCreateFakultas } from "../hooks/useCreateFakultas";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function AddFakultasModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createFakultas, loading } = useCreateFakultas();

  const [kodeFakultas, setKodeFakultas] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");

  useEffect(() => {
    if (!open) {
      setKodeFakultas("");
      setNamaFakultas("");
    }
  }, [open]);

  const disabled = useMemo(
    () => loading || !kodeFakultas.trim() || !namaFakultas.trim(),
    [loading, kodeFakultas, namaFakultas],
  );

  const submit = async () => {
    const kode = kodeFakultas.trim();
    const nama = namaFakultas.trim();

    if (!kode) {
      toast.error("Kode Fakultas Wajib Diisi!", {
        description: "Silakan isi kode fakultas sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!nama) {
      toast.error("Nama Fakultas Wajib Diisi!", {
        description: "Silakan isi nama fakultas sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await createFakultas({ kodeFakultas: kode, namaFakultas: nama });
      onSuccess?.();
      onClose();

      toast.success("Fakultas Berhasil Ditambahkan!", {
        description: `Fakultas ${nama} dengan kode ${kode} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg: string =
        err?.response?.data?.message ??
        err?.message ??
        "Terjadi kesalahan saat menambahkan fakultas.";

      const msgLower = msg.toLowerCase();
      let title = "Gagal Menambahkan Fakultas!";
      let description = msg;

      if (msgLower.includes("kode") || (msgLower.includes("duplicate") && msgLower.includes("kode"))) {
        title = "Kode Fakultas Sudah Terdaftar!";
        description = `Kode ${kode} sudah digunakan. Gunakan kode yang berbeda.`;
      } else if (msgLower.includes("nama") || (msgLower.includes("duplicate") && msgLower.includes("nama"))) {
        title = "Nama Fakultas Sudah Terdaftar!";
        description = `Nama ${nama} sudah terdaftar di sistem.`;
      } else if (msgLower.includes("duplicate") || msgLower.includes("already") || msgLower.includes("sudah")) {
        title = "Data Sudah Terdaftar!";
        description = "Kode atau nama fakultas sudah terdaftar di sistem.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
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
          <DialogTitle>Add Fakultas</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan masukkan data Fakultas baru
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 mt-8">
          <Field label="Kode Fakultas">
            <Input
              placeholder="072"
              value={kodeFakultas}
              onChange={(e) => setKodeFakultas(e.target.value)}
            />
          </Field>

          <Field label="Nama Fakultas">
            <Input
              placeholder="Fakultas Teknologi dan Rekayasa Cerdas"
              value={namaFakultas}
              onChange={(e) => setNamaFakultas(e.target.value)}
            />
          </Field>
        </div>

        <div className="pt-8">
          <Button className="w-full md:w-1/2" onClick={submit} disabled={disabled}>
            {loading ? "Menyimpan..." : "Tambah Data Fakultas"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}