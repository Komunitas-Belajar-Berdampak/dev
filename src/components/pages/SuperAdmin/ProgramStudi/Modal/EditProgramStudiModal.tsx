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

import type { ProgramStudiEntity } from "../types/program-studi";
import { useUpdateProgramStudi } from "../hooks/useUpdateProgramStudi";
import { useFakultasOptions } from "../hooks/useFakultasOptions";

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().trim();
}

export default function EditProgramStudiModal({
  open,
  onClose,
  data,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  data: ProgramStudiEntity | null;
  onSuccess?: () => void;
}) {
  const { updateProgramStudi, loading, error } = useUpdateProgramStudi();
  const { options: fakultasOptions, loading: loadingFakultas, error: errorFakultas, fakultas } =
    useFakultasOptions();

  const [namaProdi, setNamaProdi] = useState("");
  const [idFakultas, setIdFakultas] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !data) return;

    setNamaProdi(data.namaProdi ?? "");
    setLocalError(null);

    const rawId = (data as any).idFakultas ?? (data as any).facultyId ?? (data as any).fakultasId ?? "";
    if (rawId) {
      setIdFakultas(String(rawId));
      return;
    }

    const currentName = norm((data as any).namaFakultas);
    if (!currentName) {
      setIdFakultas("");
      return;
    }

    const match = (fakultas ?? []).find((f: any) => {
      const nm = norm(f.namaFakultas ?? f.nama);
      return nm === currentName;
    });

    setIdFakultas(match ? String(match._id ?? match.id) : "");
  }, [open, data?.id, fakultas]);

  const disabled = useMemo(() => {
    if (!data) return true;
    return loading || loadingFakultas || !namaProdi.trim() || !idFakultas;
  }, [data, loading, loadingFakultas, namaProdi, idFakultas]);

  const submit = async () => {
    if (!data) return;

    setLocalError(null);

    const nama = namaProdi.trim();
    if (!nama) return setLocalError("Nama program studi wajib diisi.");
    if (!idFakultas) return setLocalError("Fakultas wajib dipilih.");

    try {
      await updateProgramStudi({
        id: data.id,
        payload: {
          namaProdi: nama,
          idFakultas,
        },
      });

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
          <DialogTitle>Edit Program Studi</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan ubah data Program Studi!
          </p>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        {!data ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data...</div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <Input value={data.kodeProdi} disabled />
              <Input value={namaProdi} onChange={(e) => setNamaProdi(e.target.value)} />

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
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
