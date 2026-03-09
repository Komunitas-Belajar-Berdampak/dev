import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { useDeleteMatakuliah } from "../hooks/useDeleteMatakuliah";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

function extractErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof err?.message === "string" && err.message.length > 0) return err.message;
  return "Terjadi kesalahan saat menghapus matakuliah.";
}

interface Props {
  open: boolean;
  onClose: () => void;
  id: string | null;
  namaMatkul?: string;
  isPeriodeAktif?: boolean;
  onSuccess?: () => void;
}

export default function DeleteMatakuliahModal({ open, onClose, id, namaMatkul, isPeriodeAktif, onSuccess }: Props) {
  const { deleteMatakuliah, loading } = useDeleteMatakuliah();

  const confirm = async () => {
    if (!id) return;

    if (isPeriodeAktif) {
      toast.error("Matakuliah Tidak Dapat Dihapus!", {
        description: "Matakuliah tidak dapat dihapus karena masih berada dalam periode aktif.",
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
      onClose();
      return;
    }

    try {
      await deleteMatakuliah(id);
      onSuccess?.();
      onClose();

      toast.success("Matakuliah Berhasil Dihapus!", {
        description: namaMatkul
          ? `Matakuliah "${namaMatkul}" berhasil dihapus dari sistem.`
          : "Data matakuliah berhasil dihapus.",
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menghapus Matakuliah!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("periode") && msgLower.includes("aktif")) {
        title = "Matakuliah Tidak Dapat Dihapus!";
        description = "Matakuliah tidak dapat dihapus karena masih berada dalam periode aktif.";
      } else if (msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Matakuliah Tidak Ditemukan!";
        description = "Data matakuliah tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menghapus matakuliah.") {
        description = msg;
      }

      toast.error(title, {
        description,
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Hapus Matakuliah</DialogTitle>
        </DialogHeader>

        {isPeriodeAktif ? (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-700 font-medium">Matakuliah Tidak Dapat Dihapus</p>
            <p className="text-sm text-red-600 mt-1">
              Matakuliah <span className="font-semibold">{namaMatkul}</span> tidak dapat dihapus karena masih berada dalam periode aktif.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            Yakin ingin menghapus{" "}
            <span className="font-semibold">{namaMatkul ?? "matakuliah ini"}</span>?
            Tindakan ini tidak dapat dibatalkan.
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {isPeriodeAktif ? "Tutup" : "Batal"}
          </Button>
          {!isPeriodeAktif && (
            <Button variant="destructive" onClick={confirm} disabled={loading || !id}>
              {loading ? "Menghapus..." : "Hapus"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}