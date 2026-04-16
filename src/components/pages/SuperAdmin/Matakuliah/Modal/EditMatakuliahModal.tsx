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

import { api } from "@/lib/axios";
import type { Matakuliah, StatusMatakuliah } from "../types/matakuliah";
import { useUpdateMatakuliah } from "../hooks/useUpdateMatakuliah";
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
  return "Terjadi kesalahan saat memperbarui matakuliah.";
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

function pickId(v: any): string {
  if (!v) return "";
  if (typeof v === "string" || typeof v === "number") {
    const s = String(v).trim();
    return !s || s === "undefined" || s === "null" ? "" : s;
  }
  const s = String(v.id ?? v._id ?? "").trim();
  return !s || s === "undefined" || s === "null" ? "" : s;
}

function extractIdPeriode(d: any): string {
  const direct = pickId(d?.idPeriode);
  if (direct) return direct;
  const fromObj = pickId(d?.periode?.id ?? d?.periode?._id ?? d?.periode);
  if (fromObj) return fromObj;
  return "";
}

function extractIdPengajar(d: any): string[] {
  if (Array.isArray(d?.idPengajar)) {
    return d.idPengajar.map((x: any) => pickId(x)).filter(Boolean);
  }
  if (Array.isArray(d?.pengajar)) {
    return d.pengajar.map((x: any) => pickId(x?.id ?? x?._id ?? x)).filter(Boolean);
  }
  const single = pickId(d?.idPengajar ?? d?.pengajar?.id ?? d?.pengajar?._id);
  if (single) return [single];
  return [];
}

function extractIdMahasiswa(d: any): string[] {
  if (Array.isArray(d?.idMahasiswa)) {
    return d.idMahasiswa.map((x: any) => pickId(x)).filter(Boolean);
  }
  if (Array.isArray(d?.mahasiswa)) {
    return d.mahasiswa.map((x: any) => pickId(x?.id ?? x?._id ?? x)).filter(Boolean);
  }
  return [];
}

export default function EditMatakuliahModal({
  open,
  onClose,
  data,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  data: Matakuliah | null;
  onSuccess?: () => void;
}) {
  const { updateMatakuliah, loading: saving } = useUpdateMatakuliah();
  const { options: termOptions, loading: loadingTerms } = useAcademicTermsOptions();

  const [idPeriode, setIdPeriode] = useState("");

  const activeTermOptions = useMemo(() => {
    const active = termOptions.filter((t) => t.status.toLowerCase() === "aktif");
    const currentPeriode = termOptions.find((t) => t.id === idPeriode);
    if (currentPeriode && currentPeriode.status.toLowerCase() !== "aktif") {
      return [...active, currentPeriode];
    }
    return active;
  }, [termOptions, idPeriode]);

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [kodeMatkul, setKodeMatkul] = useState("");
  const [namaMatkul, setNamaMatkul] = useState("");
  const [sks, setSks] = useState("");
  const [kelas, setKelas] = useState("");
  const [status, setStatus] = useState<StatusMatakuliah>("aktif");
  const [idPengajarPayload, setIdPengajarPayload] = useState<string[]>([]);
  const [idMahasiswaPayload, setIdMahasiswaPayload] = useState<string[]>([]);

  const matkulId = data?.id ?? null;

  useEffect(() => {
    if (!open || !matkulId) return;

    let alive = true;
    setLoadingDetail(true);

    (async () => {
      try {
        const res = await api.get(`/courses/${matkulId}`);
        const d = res.data?.data ?? res.data;

        if (!alive) return;

        setKodeMatkul(d?.kodeMatkul ?? data?.kodeMatkul ?? "");
        setNamaMatkul(d?.namaMatkul ?? "");
        setSks(String(d?.sks ?? ""));
        setKelas(d?.kelas ?? "");
        setStatus((d?.status ?? "aktif") as StatusMatakuliah);
        setIdPeriode(extractIdPeriode(d));
        setIdPengajarPayload(extractIdPengajar(d));
        setIdMahasiswaPayload(extractIdMahasiswa(d));
      } catch (e: any) {
        if (!alive) return;

        setKodeMatkul(data?.kodeMatkul ?? "");
        setNamaMatkul(data?.namaMatkul ?? "");
        setSks(String(data?.sks ?? ""));
        setKelas(data?.kelas ?? "");
        setStatus(((data as any)?.status ?? "aktif") as StatusMatakuliah);
        setIdPeriode(extractIdPeriode(data));
        setIdPengajarPayload(extractIdPengajar(data));
        setIdMahasiswaPayload(extractIdMahasiswa(data));

        toast.error("Gagal Memuat Detail Matakuliah!", {
          description: "Data diisi dari cache. Beberapa informasi mungkin tidak lengkap.",
          icon: errorIcon,
          style: errorStyle,
          descriptionClassName: "!text-white/90",
        });
      } finally {
        if (alive) setLoadingDetail(false);
      }
    })();

    return () => { alive = false; };
  }, [open, matkulId]);

  const disabled = useMemo(() => {
    if (!data) return true;
    return (
      saving ||
      loadingDetail ||
      loadingTerms ||
      !namaMatkul.trim() ||
      !kelas.trim() ||
      !sks.trim() ||
      Number(sks) <= 0 ||
      !idPeriode ||
      !status
    );
  }, [data, saving, loadingDetail, loadingTerms, namaMatkul, kelas, sks, idPeriode, status]);

  const submit = async () => {
    if (!data) return;

    const nama = namaMatkul.trim();
    const kel = kelas.trim();

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
      await updateMatakuliah({
        id: data.id,
        payload: {
          kodeMatkul: kodeMatkul.trim() || data.kodeMatkul,
          namaMatkul: nama,
          sks: Number(sks),
          kelas: kel,
          status,
          idPeriode,
          idPengajar: idPengajarPayload,
          idMahasiswa: idMahasiswaPayload,
        },
      });
      onSuccess?.();
      onClose();

      toast.success("Matakuliah Berhasil Diperbarui!", {
        description: `Matakuliah ${nama} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Memperbarui Matakuliah!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (isDuplicateError(err, msg)) {
        title = "Nama Matakuliah Sudah Terdaftar!";
        description = `Nama "${nama}" sudah terdaftar di sistem.`;
      } else if (msgLower.includes("not found") || msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Matakuliah Tidak Ditemukan!";
        description = "Data matakuliah tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat memperbarui matakuliah.") {
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

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl w-[calc(100%-2rem)] sm:w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Matakuliah</DialogTitle>
          <p className="text-sm text-muted-foreground">Kode Matakuliah tidak bisa diubah</p>
        </DialogHeader>

        {!data ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data...</div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <Input value={kodeMatkul || data.kodeMatkul} disabled />

              <Input
                placeholder="Nama Matakuliah"
                value={namaMatkul}
                onChange={(e) => setNamaMatkul(e.target.value)}
              />

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

              <Input
                placeholder="Kelas"
                value={kelas}
                onChange={(e) => setKelas(e.target.value)}
              />

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
                        {t.status.toLowerCase() !== "aktif" && (
                          <span className="ml-2 text-xs text-muted-foreground">(Tidak Aktif)</span>
                        )}
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
                Pengajar dikelola di halaman detail matakuliah.
              </div>
            </div>

            <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
              {saving ? "Menyimpan..." : loadingDetail ? "Memuat detail..." : "Simpan Perubahan"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}