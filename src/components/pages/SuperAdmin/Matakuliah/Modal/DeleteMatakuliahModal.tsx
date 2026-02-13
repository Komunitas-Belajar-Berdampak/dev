import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteMatakuliah } from "../hooks/useDeleteMatakuliah";

interface Props {
  open: boolean;
  onClose: () => void;
  id: string | null;
  namaMatkul?: string;
  onSuccess?: () => void;
}

export default function DeleteMatakuliahModal({
  open,
  onClose,
  id,
  namaMatkul,
  onSuccess,
}: Props) {
  const { deleteMatakuliah, loading, error } = useDeleteMatakuliah();

  const confirm = async () => {
    if (!id) return;
    await deleteMatakuliah(id);
    onSuccess?.();
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
          <DialogTitle>Hapus Matakuliah</DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <p className="text-sm text-muted-foreground mt-2">
          Yakin ingin menghapus{" "}
          <span className="font-semibold">{namaMatkul ?? "matakuliah ini"}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>

          <Button
            variant="destructive"
            onClick={confirm}
            disabled={loading || !id}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
