import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { useDeleteTahunAkademikDanSemester } from "../hooks/useDeleteTahunAkademikDanSemester";

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
  return "Terjadi kesalahan saat menghapus tahun akademik.";
}

export default function DeleteTahunAkademikDanSemesterModal({
  open,
  onClose,
  id,
  periode,
  isActive = false,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  id: string | null;
  periode: string | null;
  isActive?: boolean;
  onSuccess?: () => void;
}) {
  const { deleteAcademicTerm, loading } = useDeleteTahunAkademikDanSemester();

  const confirm = async () => {
    if (!id) return;

    if (isActive) {
      toast.error("Tidak Dapat Dihapus!", {
        description: `Periode "${periode}" masih aktif. Nonaktifkan terlebih dahulu sebelum menghapus.`,
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await deleteAcademicTerm(id);
      onSuccess?.();
      onClose();

      toast.success("Tahun Akademik Berhasil Dihapus!", {
        description: periode ? `Periode "${periode}" berhasil dihapus dari sistem.` : "Data berhasil dihapus.",
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg = extractErrorMessage(err);
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menghapus Tahun Akademik!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("not found") || msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Data Tidak Ditemukan!";
        description = "Data tahun akademik tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menghapus tahun akademik.") {
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Hapus Tahun Akademik & Semester</DialogTitle>
        </DialogHeader>

        {isActive && (
          <div className="flex gap-3 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 mt-2">
            <Icon icon="mdi:alert-circle" className="text-amber-500 text-lg shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              Periode ini masih berstatus <span className="font-semibold">Aktif</span>. Menghapusnya dapat berdampak pada data yang sedang berjalan.
            </p>
          </div>
        )}

        <p className="mt-2 text-sm text-muted-foreground">
          Yakin ingin menghapus data ini? Aksi tidak bisa dibatalkan.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Tahun Akademik: <span className="font-medium text-foreground">{periode ?? "-"}</span>
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={loading || !id || isActive}>
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}