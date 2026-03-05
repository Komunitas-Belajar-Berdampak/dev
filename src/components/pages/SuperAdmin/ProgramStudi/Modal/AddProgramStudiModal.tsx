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

import { useCreateProgramStudi } from "../hooks/useCreateProgramStudi";
import { useFakultasOptions } from "../hooks/useFakultasOptions";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

/** Ekstrak pesan error dari berbagai bentuk response backend */
function extractErrorMessage(err: any): string {
  // Coba ambil dari response body dulu (axios / fetch)
  const data = err?.response?.data;

  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;

  // Fallback ke message di Error object
  if (typeof err?.message === "string" && err.message.length > 0) return err.message;

  return "Terjadi kesalahan saat menambahkan program studi.";
}

/** Cek apakah error ini adalah duplicate key (MongoDB E11000 atau pesan backend custom) */
function isDuplicateError(err: any, msg: string): boolean {
  const status = err?.response?.status;
  const msgLower = msg.toLowerCase();

  // HTTP 409 Conflict → pasti duplicate
  if (status === 409) return true;

  // MongoDB raw error string
  if (msgLower.includes("e11000")) return true;

  // Kata kunci umum
  if (
    msgLower.includes("duplicate") ||
    msgLower.includes("already") ||
    msgLower.includes("sudah terdaftar") ||
    msgLower.includes("sudah ada")
  ) return true;

  // Backend kadang kirim 500 dengan pesan generic untuk duplicate
  // tapi kita bisa cek apakah ada field hint di response
  const errData = err?.response?.data;
  if (
    errData?.keyPattern ||     // MongoDB duplicate key detail
    errData?.keyValue ||
    errData?.code === 11000
  ) return true;

  return false;
}

export default function AddProgramStudiModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createProgramStudi, loading } = useCreateProgramStudi();
  const { options: fakultasOptions, loading: loadingFakultas } = useFakultasOptions();

  const [kodeProdi, setKodeProdi] = useState("");
  const [namaProdi, setNamaProdi] = useState("");
  const [idFakultas, setIdFakultas] = useState("");

  useEffect(() => {
    if (!open) {
      setKodeProdi("");
      setNamaProdi("");
      setIdFakultas("");
    }
  }, [open]);

  const disabled = useMemo(
    () => loading || loadingFakultas || !kodeProdi.trim() || !namaProdi.trim() || !idFakultas,
    [loading, loadingFakultas, kodeProdi, namaProdi, idFakultas],
  );

  const submit = async () => {
    const kode = kodeProdi.trim();
    const nama = namaProdi.trim();

    if (!kode) {
      toast.error("Kode Program Studi Wajib Diisi!", {
        description: "Silakan isi kode program studi sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!nama) {
      toast.error("Nama Program Studi Wajib Diisi!", {
        description: "Silakan isi nama program studi sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!idFakultas) {
      toast.error("Fakultas Wajib Dipilih!", {
        description: "Silakan pilih fakultas untuk program studi ini.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await createProgramStudi({ kodeProdi: kode, namaProdi: nama, idFakultas });
      onSuccess?.();
      onClose();

      toast.success("Program Studi Berhasil Ditambahkan!", {
        description: `Program studi ${nama} dengan kode ${kode} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menambahkan Program Studi!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (isDuplicateError(err, msg)) {
        // Tentukan field mana yang duplicate berdasarkan hint dari backend
        const keyPattern = err?.response?.data?.keyPattern ?? {};
        const isKodeDuplicate =
          "kodeProdi" in keyPattern ||
          msgLower.includes("kodep") ||
          msgLower.includes("kode_prodi") ||
          (msgLower.includes("kode") && !msgLower.includes("nama"));

        const isNamaDuplicate =
          "namaProdi" in keyPattern ||
          msgLower.includes("namap") ||
          msgLower.includes("nama_prodi") ||
          msgLower.includes("nama");

        if (isKodeDuplicate && !isNamaDuplicate) {
          title = "Kode Program Studi Sudah Terdaftar!";
          description = `Kode "${kode}" sudah digunakan. Gunakan kode yang berbeda.`;
        } else if (isNamaDuplicate && !isKodeDuplicate) {
          title = "Nama Program Studi Sudah Terdaftar!";
          description = `Nama "${nama}" sudah terdaftar di sistem.`;
        } else {
          // Tidak bisa bedain, tampilkan keduanya
          title = "Data Sudah Terdaftar!";
          description = `Kode "${kode}" atau nama "${nama}" sudah terdaftar di sistem.`;
        }
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        // 500 yang bukan duplicate → server error murni
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menambahkan program studi.") {
        // Pesan custom dari backend yang tidak masuk kategori di atas
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Program Studi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            placeholder="Kode Program Studi"
            value={kodeProdi}
            onChange={(e) => setKodeProdi(e.target.value)}
          />
          <Input
            placeholder="Nama Program Studi"
            value={namaProdi}
            onChange={(e) => setNamaProdi(e.target.value)}
          />
          <Select value={idFakultas} onValueChange={setIdFakultas}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder={loadingFakultas ? "Memuat fakultas..." : "Pilih Fakultas"} />
            </SelectTrigger>
            <SelectContent>
              {fakultasOptions.length === 0 ? (
                <div className="px-3 py-2 text-muted-foreground text-sm">Tidak ada data fakultas</div>
              ) : (
                fakultasOptions.map((f) => (
                  <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
          {loading ? "Menyimpan..." : "Tambah Program Studi"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}