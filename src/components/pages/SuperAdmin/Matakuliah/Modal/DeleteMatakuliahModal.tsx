import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteMatakuliahModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Matakuliah</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Apakah Anda yakin ingin menghapus matakuliah ini?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>

          <Button variant="destructive" onClick={onConfirm}>
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
