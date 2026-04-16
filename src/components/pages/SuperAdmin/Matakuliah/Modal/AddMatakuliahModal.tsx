import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import type { StatusMatakuliah } from "../types/matakuliah";
import { useCreateMatakuliah } from "../hooks/useCreateMatakuliah";
import { useAcademicTermsOptions } from "../hooks/useAcademicTermsOptions";

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
  return "Terjadi kesalahan saat menambahkan matakuliah.";
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

export default function AddMatakuliahModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createMatakuliah, loading: saving } = useCreateMatakuliah();
  const { options: termOptions, loading: loadingTerms } = useAcademicTermsOptions();

  // Hanya tampilkan periode yang aktif
  const activeTermOptions = useMemo(
    () => termOptions.filter((t) => t.status.toLowerCase() === "aktif"),
    [termOptions],
  );

  const [kodeMatkul, setKodeMatkul] = useState("");
  const [namaMatkul, setNamaMatkul] = useState("");
  const [sks, setSks] = useState("");
  const [kelas, setKelas] = useState("");
  const [idPeriode, setIdPeriode] = useState("");
  const [status, setStatus] = useState<StatusMatakuliah>("aktif");

  useEffect(() => {
    if (!open) {
      setKodeMatkul("");
      setNamaMatkul("");
      setSks("");
      setKelas("");
      setIdPeriode("");
      setStatus("aktif");
    }
  }, [open]);

  const disabled = useMemo(
    () =>
      saving ||
      loadingTerms ||
      !kodeMatkul.trim() ||
      !namaMatkul.trim() ||
      !kelas.trim() ||
      !sks.trim() ||
      Number(sks) <= 0 ||
      !idPeriode ||
      !status,
    [saving, loadingTerms, kodeMatkul, namaMatkul, kelas, sks, idPeriode, status],
  );

  const submit = async () => {
    const kode = kodeMatkul.trim();
    const nama = namaMatkul.trim();
    const kel = kelas.trim();

    if (!kode) {
      toast.error("Kode Matakuliah Wajib Diisi!", {
        description: "Silakan isi kode matakuliah sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!nama) {
      toast.error("Nama Matakuliah Wajib Diisi!", {
        description: "Silakan isi nama matakuliah sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!kel) {
      toast.error("Kelas Wajib Diisi!", {
        description: "Silakan isi kelas sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!sks.trim() || Number(sks) <= 0) {
      toast.error("SKS Tidak Valid!", {
        description: "SKS harus berupa angka lebih dari 0.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!idPeriode) {
      toast.error("Periode Wajib Dipilih!", {
        description: "Silakan pilih periode untuk matakuliah ini.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await createMatakuliah({
        kodeMatkul: kode,
        namaMatkul: nama,
        sks: Number(sks),
        kelas: kel,
        status,
        idPeriode,
        idPengajar: [],
        idMahasiswa: [],
      });
      onSuccess?.();
      onClose();

      toast.success("Matakuliah Berhasil Ditambahkan!", {
        description: `Matakuliah ${nama} dengan kode ${kode} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menambahkan Matakuliah!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (isDuplicateError(err, msg)) {
        const keyPattern = err?.response?.data?.keyPattern ?? {};
        const isKodeDuplicate = "kodeMatkul" in keyPattern || msgLower.includes("kode");
        const isNamaDuplicate = "namaMatkul" in keyPattern || msgLower.includes("nama");

        if (isKodeDuplicate && !isNamaDuplicate) {
          title = "Kode Matakuliah Sudah Terdaftar!";
          description = `Kode "${kode}" sudah digunakan. Gunakan kode yang berbeda.`;
        } else if (isNamaDuplicate && !isKodeDuplicate) {
          title = "Nama Matakuliah Sudah Terdaftar!";
          description = `Nama "${nama}" sudah terdaftar di sistem.`;
        } else {
          title = "Data Sudah Terdaftar!";
          description = `Kode "${kode}" atau nama "${nama}" sudah terdaftar di sistem.`;
        }
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menambahkan matakuliah.") {
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
          <DialogTitle>Add Matakuliah</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input placeholder="Kode Matakuliah" value={kodeMatkul} onChange={(e) => setKodeMatkul(e.target.value)} />
          <Input placeholder="Nama Matakuliah" value={namaMatkul} onChange={(e) => setNamaMatkul(e.target.value)} />

          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="SKS (contoh: 3)"
            value={sks}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) setSks(v);
            }}
          />

          <Input placeholder="Kelas (contoh: A)" value={kelas} onChange={(e) => setKelas(e.target.value)} />

          <Select value={idPeriode} onValueChange={setIdPeriode}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder={loadingTerms ? "Memuat periode..." : "Pilih Periode"} />
            </SelectTrigger>
            <SelectContent>
              {activeTermOptions.length === 0 && !loadingTerms ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  Tidak ada periode aktif
                </div>
              ) : (
                activeTermOptions.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.label} - {t.semesterType}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={(v) => setStatus(v as StatusMatakuliah)}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-xs text-muted-foreground">
            Pengajar dapat ditambahkan di halaman detail matakuliah.
          </div>
        </div>

        <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
          {saving ? "Menyimpan..." : "Tambah Matakuliah"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}