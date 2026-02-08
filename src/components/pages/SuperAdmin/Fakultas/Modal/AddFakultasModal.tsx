import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useCreateFakultas } from "../hooks/useCreateFakultas";

export default function AddFakultasModal({
  open,
  onClose,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createFakultas, loading, error } = useCreateFakultas();

  const [kodeFakultas, setKodeFakultas] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return (
      loading ||
      !kodeFakultas.trim() ||
      !namaFakultas.trim()
    );
  }, [loading, kodeFakultas, namaFakultas]);

  const submit = async () => {
    setLocalError(null);

    const kode = kodeFakultas.trim();
    const nama = namaFakultas.trim();

    if (!kode) return setLocalError("Kode fakultas wajib diisi.");
    if (!nama) return setLocalError("Nama fakultas wajib diisi.");

    try {
      await createFakultas({
        kodeFakultas: kode,
        namaFakultas: nama,
      });

      // reset
      setKodeFakultas("");
      setNamaFakultas("");
      onSuccess?.();
      onClose();
    } catch {
      // error sudah ke-handle dari hook
    }
  };

  const combinedError = localError ?? error ?? null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          // reset error saat close
          setLocalError(null);
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add Fakultas</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan masukkan data Fakultas baru
          </p>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        {/* FORM */}
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

        {/* ACTION */}
        <div className="pt-8">
          <Button
            className="w-full md:w-1/2"
            onClick={submit}
            disabled={disabled}
          >
            {loading ? "Menyimpan..." : "Tambah Data Fakultas"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}
