import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PengajarEntity } from "./AddPengajarModal";

export default function DeletePengajarModal({
  open,
  onClose,
  data,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  data: PengajarEntity | null;
  onConfirm: (id: string) => void;
}) {
  const confirm = () => {
    if (!data?.id) return;
    onConfirm(data.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Pengajar</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Yakin ingin menghapus{" "}
          <span className="font-semibold">{data?.nama ?? "pengajar ini"}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button variant="destructive" onClick={confirm} disabled={!data?.id}>
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}