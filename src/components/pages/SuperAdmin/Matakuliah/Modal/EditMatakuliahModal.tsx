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

import { api } from "@/lib/axios";
import type { Matakuliah, StatusMatakuliah } from "../types/matakuliah";
import { useUpdateMatakuliah } from "../hooks/useUpdateMatakuliah";
import { useAcademicTermsOptions } from "../hooks/useAcademicTermsOptions";

function pickId(v: any): string {
  if (!v) return "";
  if (typeof v === "string" || typeof v === "number") {
    const s = String(v).trim();
    return !s || s === "undefined" || s === "null" ? "" : s;
  }
  const s = String(v.id ?? v._id ?? "").trim();
  return !s || s === "undefined" || s === "null" ? "" : s;
}

/** Ekstrak idPeriode dari berbagai format response backend */
function extractIdPeriode(d: any): string {
  const direct = pickId(d?.idPeriode);
  if (direct) return direct;
  const fromObj = pickId(d?.periode?.id ?? d?.periode?._id ?? d?.periode);
  if (fromObj) return fromObj;
  return "";
}

/** Ekstrak idPengajar (string[]) dari berbagai format response backend */
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

/** Ekstrak idMahasiswa (string[]) */
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
  const { updateMatakuliah, loading: saving, error: saveError } = useUpdateMatakuliah();
  const { options: termOptions, loading: loadingTerms, error: termError } = useAcademicTermsOptions();

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [kodeMatkul, setKodeMatkul] = useState("");
  const [namaMatkul, setNamaMatkul] = useState("");
  const [sks, setSks] = useState("");
  const [kelas, setKelas] = useState("");
  const [idPeriode, setIdPeriode] = useState("");
  const [status, setStatus] = useState<StatusMatakuliah>("aktif");
  const [idPengajarPayload, setIdPengajarPayload] = useState<string[]>([]);
  const [idMahasiswaPayload, setIdMahasiswaPayload] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);

  const matkulId = data?.id ?? null;

  useEffect(() => {
    if (!open || !matkulId) return;

    let alive = true;
    setDetailError(null);
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
        setLocalError(null);
      } catch (e: any) {
        if (!alive) return;

        setDetailError(
          e?.response?.data?.message ?? e?.message ?? "Gagal memuat detail matakuliah"
        );

        // fallback ke data ringkas dari list
        setKodeMatkul(data?.kodeMatkul ?? "");
        setNamaMatkul(data?.namaMatkul ?? "");
        setSks(String(data?.sks ?? ""));
        setKelas(data?.kelas ?? "");
        setStatus(((data as any)?.status ?? "aktif") as StatusMatakuliah);
        setIdPeriode(extractIdPeriode(data));
        setIdPengajarPayload(extractIdPengajar(data));
        setIdMahasiswaPayload(extractIdMahasiswa(data));
      } finally {
        if (!alive) return;
        setLoadingDetail(false);
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
    setLocalError(null);

    if (!namaMatkul.trim()) return setLocalError("Nama matakuliah wajib diisi.");
    if (!kelas.trim()) return setLocalError("Kelas wajib diisi.");
    if (!sks.trim()) return setLocalError("SKS wajib diisi.");
    if (Number(sks) <= 0) return setLocalError("SKS harus > 0.");
    if (!idPeriode) return setLocalError("Periode wajib dipilih.");

    await updateMatakuliah({
      id: data.id,
      payload: {
        kodeMatkul: kodeMatkul.trim() || data.kodeMatkul,
        namaMatkul: namaMatkul.trim(),
        sks: Number(sks),
        kelas: kelas.trim(),
        status,
        idPeriode,
        idPengajar: idPengajarPayload,
        idMahasiswa: idMahasiswaPayload,
      },
    });
    

    onSuccess?.();
    onClose();
  };

  const combinedError = localError ?? detailError ?? termError ?? saveError ?? null;

  if (!open) return null;

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
          <DialogTitle>Edit Matakuliah</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Kode Matakuliah tidak bisa diubah
          </p>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        {!data ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data...</div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              {/* kodeMatkul: disabled di UI tapi tetap dikirim via state */}
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
                  <SelectValue
                    placeholder={loadingTerms ? "Memuat periode..." : "Pilih Periode"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={status}
                onValueChange={(v) => setStatus(v as StatusMatakuliah)}
              >
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
              {saving
                ? "Menyimpan..."
                : loadingDetail
                ? "Memuat detail..."
                : "Simpan Perubahan"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}