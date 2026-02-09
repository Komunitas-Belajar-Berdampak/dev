import { useEffect, useMemo, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { Matakuliah, StatusMatakuliah } from "../types/matakuliah";
import { useUpdateMatakuliah } from "../hooks/useUpdateMatakuliah";
import { useAcademicTermsOptions } from "../hooks/useAcademicTermsOptions";
import { useDosenOptions } from "../hooks/useDosenOptions";

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

  const [namaMatkul, setNamaMatkul] = useState("");
  const [sks, setSks] = useState<number>(0);
  const [kelas, setKelas] = useState("");
  const [idPeriode, setIdPeriode] = useState("");
  const [idPengajar, setIdPengajar] = useState("");
  const [status, setStatus] = useState<StatusMatakuliah>("aktif");
  const [deskripsi, setDeskripsi] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !data) return;
    setNamaMatkul(data.namaMatkul ?? "");
    setSks(Number(data.sks ?? 0));
    setKelas(data.kelas ?? "");
    setIdPeriode(data.idPeriode ?? "");
    setIdPengajar(data.idPengajar ?? "");
    setStatus((data.status ?? "aktif") as StatusMatakuliah);
    setDeskripsi(data.deskripsi ?? "");
    setLocalError(null);
  }, [open, data?.id]);

  const disabled = useMemo(() => {
    if (!data) return true;
    return (
      saving ||
      loadingTerms ||
      loadingDosen ||
      !namaMatkul.trim() ||
      !kelas.trim() ||
      !(Number(sks) > 0) ||
      !idPeriode ||
      !idPengajar ||
      !status
    );
  }, [data, saving, loadingTerms, loadingDosen, namaMatkul, kelas, sks, idPeriode, idPengajar, status]);

  const submit = async () => {
    if (!data) return;
    setLocalError(null);

    if (!namaMatkul.trim()) return setLocalError("Nama matakuliah wajib diisi.");
    if (!kelas.trim()) return setLocalError("Kelas wajib diisi.");
    if (!(Number(sks) > 0)) return setLocalError("SKS harus > 0.");
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
        deskripsi: deskripsi.trim() ? deskripsi.trim() : null,
      },
    });

    onSuccess?.();
    onClose();
  };

  const combinedError = localError ?? termError ?? dosenError ?? saveError ?? null;

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
          <p className="text-sm text-muted-foreground">Kode Matakuliah tidak bisa diubah</p>
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
              <Input value={data.kodeMatkul} disabled />
              <Input value={namaMatkul} onChange={(e) => setNamaMatkul(e.target.value)} />
              <Input type="number" value={String(sks)} onChange={(e) => setSks(Number(e.target.value))} />
              <Input value={kelas} onChange={(e) => setKelas(e.target.value)} />

              <Select value={idPeriode} onValueChange={setIdPeriode}>
                <SelectTrigger className="w-full border border-black/20">
                  <SelectValue placeholder={loadingTerms ? "Memuat periode..." : "Pilih Periode"} />
                </SelectTrigger>
                <SelectContent>
                  {termOptions.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={idPengajar} onValueChange={setIdPengajar}>
                <SelectTrigger className="w-full border border-black/20">
                  <SelectValue placeholder={loadingDosen ? "Memuat dosen..." : "Pilih Pengajar (Dosen)"} />
                </SelectTrigger>
                <SelectContent>
                  {dosenOptions.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
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

              <Textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi (opsional)" />
            </div>

            <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
