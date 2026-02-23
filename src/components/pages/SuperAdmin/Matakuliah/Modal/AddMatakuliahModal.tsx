import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { StatusMatakuliah } from "../types/matakuliah";
import { useCreateMatakuliah } from "../hooks/useCreateMatakuliah";
import { useAcademicTermsOptions } from "../hooks/useAcademicTermsOptions";

export default function AddMatakuliahModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createMatakuliah, loading: saving, error: saveError } = useCreateMatakuliah();
  const { options: termOptions, loading: loadingTerms, error: termError } = useAcademicTermsOptions();

  const [kodeMatkul, setKodeMatkul] = useState("");
  const [namaMatkul, setNamaMatkul] = useState("");
  const [sks, setSks] = useState("");
  const [kelas, setKelas] = useState("");
  const [idPeriode, setIdPeriode] = useState("");
  const [status, setStatus] = useState<StatusMatakuliah>("aktif");
  const [deskripsi, setDeskripsi] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return (
      saving ||
      loadingTerms ||
      !kodeMatkul.trim() ||
      !namaMatkul.trim() ||
      !kelas.trim() ||
      !sks.trim() ||
      Number(sks) <= 0 ||
      !idPeriode ||
      !status
    );
  }, [saving, loadingTerms, kodeMatkul, namaMatkul, kelas, sks, idPeriode, status]);

  const submit = async () => {
    setLocalError(null);

    if (!kodeMatkul.trim()) return setLocalError("Kode matakuliah wajib diisi.");
    if (!namaMatkul.trim()) return setLocalError("Nama matakuliah wajib diisi.");
    if (!kelas.trim()) return setLocalError("Kelas wajib diisi.");
    if (!sks.trim()) return setLocalError("SKS wajib diisi.");
    if (Number(sks) <= 0) return setLocalError("SKS harus lebih dari 0.");
    if (!idPeriode) return setLocalError("Periode wajib dipilih.");

    try {
      await createMatakuliah({
        kodeMatkul: kodeMatkul.trim(),
        namaMatkul: namaMatkul.trim(),
        sks: Number(sks),
        kelas: kelas.trim(),
        status,
        idPeriode,
        idMahasiswa: [],
        pengajar: [],
        deskripsi: deskripsi.trim() ? deskripsi.trim() : undefined,
      });

      setKodeMatkul("");
      setNamaMatkul("");
      setSks("");
      setKelas("");
      setIdPeriode("");
      setStatus("aktif");
      setDeskripsi("");

      onSuccess?.();
      onClose();
    } catch {
      // handled by hook
    }
  };

  const combinedError = localError ?? termError ?? saveError ?? null;

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
          <DialogTitle>Add Matakuliah</DialogTitle>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

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
              {termOptions.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.label}
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

          <Textarea placeholder="Deskripsi (opsional)" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} />
        </div>

        <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
          {saving ? "Menyimpan..." : "Tambah Matakuliah"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}