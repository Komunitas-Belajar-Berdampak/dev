import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PengajarEntity } from "./AddPengajarModal";

export default function EditPengajarModal({
  open,
  onClose,
  data,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  data: PengajarEntity | null;
  onSubmit: (payload: PengajarEntity) => void;
}) {
  const [nrp, setNrp] = useState("");
  const [nama, setNama] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLocalError(null);
    setNrp(data?.nrp ?? "");
    setNama(data?.nama ?? "");
  }, [open, data]);

  const disabled = useMemo(() => {
    if (!data) return true;
    return !nrp.trim() || !nama.trim();
  }, [data, nrp, nama]);

  const submit = () => {
    if (!data) return;
    setLocalError(null);

    if (!nrp.trim()) return setLocalError("NRP wajib diisi.");
    if (!nama.trim()) return setLocalError("Nama wajib diisi.");

    onSubmit({
      ...data,
      nrp: nrp.trim(),
      nama: nama.trim(),
    });

    onClose();
  };

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
          <DialogTitle>Edit Pengajar</DialogTitle>
        </DialogHeader>

        {localError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {localError}
          </div>
        ) : null}

        {!data ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data...</div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <Input value={nrp} onChange={(e) => setNrp(e.target.value)} />
              <Input value={nama} onChange={(e) => setNama(e.target.value)} />
            </div>

            <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
              Simpan Perubahan
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}