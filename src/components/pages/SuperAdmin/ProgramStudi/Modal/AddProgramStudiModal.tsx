import { useMemo, useState } from "react";
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

import { useCreateProgramStudi } from "../hooks/useCreateProgramStudi";
import { useFakultasOptions } from "../hooks/useFakultasOptions";

export default function AddProgramStudiModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createProgramStudi, loading, error } = useCreateProgramStudi();
  const {
    options: fakultasOptions,
    loading: loadingFakultas,
    error: errorFakultas,
  } = useFakultasOptions();

  const [kodeProdi, setKodeProdi] = useState("");
  const [namaProdi, setNamaProdi] = useState("");
  const [idFakultas, setIdFakultas] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return (
      loading ||
      loadingFakultas ||
      !kodeProdi.trim() ||
      !namaProdi.trim() ||
      !idFakultas
    );
  }, [loading, loadingFakultas, kodeProdi, namaProdi, idFakultas]);

  const submit = async () => {
    setLocalError(null);

    const kode = kodeProdi.trim();
    const nama = namaProdi.trim();

    if (!kode) return setLocalError("Kode program studi wajib diisi.");
    if (!nama) return setLocalError("Nama program studi wajib diisi.");
    if (!idFakultas) return setLocalError("Fakultas wajib dipilih.");

    try {
      await createProgramStudi({
        kodeProdi: kode,
        namaProdi: nama,
        idFakultas,
      });

      setKodeProdi("");
      setNamaProdi("");
      setIdFakultas("");
      onSuccess?.();
      onClose();
    } catch {
    }
  };

  const combinedError = localError ?? errorFakultas ?? error ?? null;

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
          <DialogTitle>Add Program Studi</DialogTitle>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

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
              <SelectValue
                placeholder={loadingFakultas ? "Memuat fakultas..." : "Pilih Fakultas"}
              />
            </SelectTrigger>
            <SelectContent>
              {fakultasOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  Tidak ada data fakultas
                </div>
              ) : (
                fakultasOptions.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
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
