import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type PengajarEntity = {
  id: string;
  nrp: string;
  nama: string;
};

export default function AddPengajarModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: Omit<PengajarEntity, "id">) => void;
}) {
  const [nrp, setNrp] = useState("");
  const [nama, setNama] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    return !nrp.trim() || !nama.trim();
  }, [nrp, nama]);

  const submit = () => {
    setLocalError(null);

    if (!nrp.trim()) return setLocalError("NRP wajib diisi.");
    if (!nama.trim()) return setLocalError("Nama wajib diisi.");

    onSubmit({
      nrp: nrp.trim(),
      nama: nama.trim(),
    });

    setNrp("");
    setNama("");
    onClose();
  };

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
          <DialogTitle>Tambah Pengajar</DialogTitle>
        </DialogHeader>

        {localError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {localError}
          </div>
        ) : null}

        <div className="space-y-4 mt-4">
          <Input
            placeholder="NRP / NIP"
            value={nrp}
            onChange={(e) => setNrp(e.target.value)}
          />
          <Input
            placeholder="Nama Pengajar"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
        </div>

        <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
          Tambah Pengajar
        </Button>
      </DialogContent>
    </Dialog>
  );
}