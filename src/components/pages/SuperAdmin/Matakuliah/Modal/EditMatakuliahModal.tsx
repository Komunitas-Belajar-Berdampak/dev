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
import { Textarea } from "@/components/ui/textarea";

import { api } from "@/lib/axios";
import type { Matakuliah, StatusMatakuliah } from "../types/matakuliah";
import { useUpdateMatakuliah } from "../hooks/useUpdateMatakuliah";
import { useAcademicTermsOptions } from "../hooks/useAcademicTermsOptions";
import { useDosenOptions } from "../hooks/useDosenOptions";

function pickId(v: any): string {
  if (!v) return "";
  if (typeof v === "string" || typeof v === "number") {
    const s = String(v).trim();
    return !s || s === "undefined" || s === "null" ? "" : s;
  }
  const s = String(v.id ?? v._id ?? "").trim();
  return !s || s === "undefined" || s === "null" ? "" : s;
}

function pickText(...vals: any[]): string {
  for (const v of vals) {
    const s = String(v ?? "").trim();
    if (s) return s;
  }
  return "";
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
  const { options: dosenOptions, loading: loadingDosen, error: dosenError } = useDosenOptions();

  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [namaMatkul, setNamaMatkul] = useState("");
  const [sks, setSks] = useState("");
  const [kelas, setKelas] = useState("");
  const [idPeriode, setIdPeriode] = useState("");
  const [idPengajar, setIdPengajar] = useState("");
  const [status, setStatus] = useState<StatusMatakuliah>("aktif");
  const [deskripsi, setDeskripsi] = useState("");
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
        const payload = res.data?.data ?? res.data;

        if (!alive) return;

        const d = payload ?? data;

        setNamaMatkul(d?.namaMatkul ?? "");
        setSks(String(d?.sks ?? ""));
        setKelas(d?.kelas ?? "");
        setStatus((d?.status ?? "aktif") as StatusMatakuliah);

        setIdPeriode(
          pickId(d?.idPeriode) ||
          pickId(d?.periode?.id) ||
          pickId(d?.periode?._id) ||
          ""
        );

        setIdPengajar(
          pickId(d?.idPengajar) ||
          pickId(d?.pengajar?.id) ||
          pickId(d?.pengajar?._id) ||
          pickId(d?.dosen?.id) ||
          pickId(d?.dosen?._id) ||
          ""
        );

        setDeskripsi(
          pickText(
            d?.deskripsi,
            d?.description,
            d?.keterangan,
            d?.desc,
            d?.detail,
            d?.notes,
            d?.catatan
          )
        );

        setLocalError(null);
      } catch (e: any) {
        if (!alive) return;
        setDetailError(
          e?.response?.data?.message ??
            e?.message ??
            "Gagal memuat detail matakuliah"
        );

        // fallback ke data ringkas agar tetap bisa edit
        setNamaMatkul(data?.namaMatkul ?? "");
        setSks(String(data?.sks ?? ""));
        setKelas(data?.kelas ?? "");
        setStatus(((data as any)?.status ?? "aktif") as StatusMatakuliah);
        setIdPeriode(pickId((data as any)?.idPeriode) || "");
        setIdPengajar(pickId((data as any)?.idPengajar) || "");
        setDeskripsi(pickText((data as any)?.deskripsi));
      } finally {
        if (!alive) return;
        setLoadingDetail(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [open, matkulId]);

  const disabled = useMemo(() => {
    if (!data) return true;
    return (
      saving ||
      loadingDetail ||
      loadingTerms ||
      loadingDosen ||
      !namaMatkul.trim() ||
      !kelas.trim() ||
      !sks.trim() ||
      Number(sks) <= 0 ||
      !idPeriode ||
      !idPengajar ||
      !status
    );
  }, [
    data,
    saving,
    loadingDetail,
    loadingTerms,
    loadingDosen,
    namaMatkul,
    kelas,
    sks,
    idPeriode,
    idPengajar,
    status,
  ]);

  const submit = async () => {
    if (!data) return;
    setLocalError(null);

    if (!namaMatkul.trim()) return setLocalError("Nama matakuliah wajib diisi.");
    if (!kelas.trim()) return setLocalError("Kelas wajib diisi.");
    if (!sks.trim()) return setLocalError("SKS wajib diisi.");
    if (Number(sks) <= 0) return setLocalError("SKS harus > 0.");
    if (!idPeriode) return setLocalError("Periode wajib dipilih.");
    if (!idPengajar) return setLocalError("Pengajar wajib dipilih.");

    await updateMatakuliah({
      id: data.id,
      payload: {
        namaMatkul: namaMatkul.trim(),
        sks: Number(sks),
        kelas: kelas.trim(),
        status,
        idPeriode,
        idPengajar,
      },
    });

    onSuccess?.();
    onClose();
  };

  const combinedError =
    localError ?? detailError ?? termError ?? dosenError ?? saveError ?? null;

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
              <Input value={(data as any).kodeMatkul} disabled />

              <Input value={namaMatkul} onChange={(e) => setNamaMatkul(e.target.value)} />

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

              <Input value={kelas} onChange={(e) => setKelas(e.target.value)} />

              <Select value={idPeriode} onValueChange={setIdPeriode}>
                <SelectTrigger className="w-full border border-black/20">
                  <SelectValue placeholder={loadingTerms ? "Memuat periode..." : "Pilih Periode"} />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={idPengajar} onValueChange={setIdPengajar}>
                <SelectTrigger className="w-full border border-black/20">
                  <SelectValue placeholder={loadingDosen ? "Memuat dosen..." : "Pilih Pengajar (Dosen)"} />
                </SelectTrigger>
                <SelectContent>
                  {dosenOptions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.label}
                    </SelectItem>
                  ))}
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

              <Textarea
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                placeholder="Deskripsi (opsional)"
              />
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
