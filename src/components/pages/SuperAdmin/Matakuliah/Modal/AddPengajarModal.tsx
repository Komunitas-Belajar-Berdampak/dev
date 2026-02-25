import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useDosenOptions } from "../hooks/useDosenOptions";

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
  onSubmit: (payload: { id: string }) => void;
}) {
  const { options, loading } = useDosenOptions();
  const [selectedId, setSelectedId] = useState<string>("");

  const disabled = useMemo(() => {
    return !selectedId;
  }, [selectedId]);

  const submit = () => {
    if (!selectedId) return;

    onSubmit({ id: selectedId });
    setSelectedId("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setSelectedId("");
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pengajar</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Select
            value={selectedId}
            onValueChange={setSelectedId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih Dosen" />
            </SelectTrigger>

            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full mt-6"
          onClick={submit}
          disabled={disabled || loading}
        >
          Tambah Pengajar
        </Button>
      </DialogContent>
    </Dialog>
  );
}