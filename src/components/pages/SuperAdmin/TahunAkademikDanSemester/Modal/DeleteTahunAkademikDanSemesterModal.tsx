import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTahunAkademikDanSemester } from "../hooks/useDeleteTahunAkademikDanSemester";

export default function DeleteTahunAkademikDanSemesterModal({
  open,
  onClose,
  id,
  periode,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  id: string | null;
  periode: string | null;
  onSuccess?: () => void;
}) {
  const { deleteAcademicTerm, loading, error } =
    useDeleteTahunAkademikDanSemester();

  const confirm = async () => {
    if (!id) return;
    await deleteAcademicTerm(id);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Tahun Akademik & Semester</DialogTitle>
        </DialogHeader>

        {error ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <p className="mt-4 text-sm text-muted-foreground">
          Yakin ingin menghapus data ini? Aksi tidak bisa dibatalkan.
        </p>

        <p className="mt-2 text-xs text-muted-foreground">Tahun Akademik: {periode ?? "null"}</p>

        <div className="mt-6 flex justify-end gap-2">
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
