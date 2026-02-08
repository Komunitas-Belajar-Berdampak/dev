import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useUpdateFakultas } from "../hooks/useUpdateFakultas";
import type { FakultasEntity } from "../types/fakultas";

export default function EditFakultasModal({
  open,
  onClose,
  fakultas,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  fakultas: FakultasEntity | null;
  onSuccess?: () => void;
}) {
  const { updateFakultas, loading, error } = useUpdateFakultas();

  const [kodeFakultas, setKodeFakultas] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !fakultas) return;
    setKodeFakultas(fakultas.kodeFakultas ?? "");
    setNamaFakultas(fakultas.namaFakultas ?? "");
    setLocalError(null);
  }, [open, fakultas?.id]);

  const disabled = useMemo(() => {
    return loading || !namaFakultas.trim();
  }, [loading, namaFakultas]);

  const submit = async () => {
    if (!fakultas) return;

    setLocalError(null);

    const nama = namaFakultas.trim();
    if (!nama) return setLocalError("Nama fakultas wajib diisi.");

    try {
      // ✅ update cuma nama (kode gak ikut dikirim)
      await updateFakultas({
        id: fakultas.id,
        payload: { namaFakultas: nama },
      });

      onSuccess?.();
      onClose();
    } catch {
      // error sudah dihandle hook
    }
  };

  const combinedError = localError ?? error ?? null;

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Fakultas</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Kode Fakultas tidak bisa diubah
          </p>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        {!fakultas ? (
          <div className="py-10 text-sm text-muted-foreground">
            Memuat data fakultas...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mt-8">
              <Field label="Kode Fakultas">
                <Input
                  value={kodeFakultas}
                  onChange={(e) => setKodeFakultas(e.target.value)}
                  disabled // ✅ dikunci
                />
              </Field>

              <Field label="Nama Fakultas">
                <Input
                  value={namaFakultas}
                  onChange={(e) => setNamaFakultas(e.target.value)}
                />
              </Field>
            </div>

            <div className="pt-8">
              <Button
                className="w-full md:w-1/2"
                onClick={submit}
                disabled={disabled}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </>
        )}
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
