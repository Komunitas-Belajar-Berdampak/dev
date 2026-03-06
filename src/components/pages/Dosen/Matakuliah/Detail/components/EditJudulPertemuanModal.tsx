import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { useUpdateMeeting } from "../../hooks/useUpdateMeeting";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function EditJudulPertemuanModal({
  open,
  onClose,
  idPertemuan,
  nomorPertemuan,
  judulAwal,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  idPertemuan: string;
  nomorPertemuan: number;
  judulAwal: string;
  onSuccess?: () => void;
}) {
  const { updateMeeting, loading } = useUpdateMeeting();
  const [judul, setJudul] = useState(judulAwal);

  // Reset ke nilai awal setiap kali modal dibuka
  useEffect(() => {
    if (open) setJudul(judulAwal);
  }, [open, judulAwal]);

  const submit = async () => {
    const trimmed = judul.trim();

    if (!trimmed) {
      toast.error("Judul Wajib Diisi!", {
        description: "Silakan isi judul pertemuan sebelum menyimpan.",
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
      return;
    }

    if (trimmed === judulAwal.trim()) {
      onClose();
      return;
    }

    try {
      await updateMeeting(idPertemuan, trimmed);
      onSuccess?.();
      onClose();

      toast.success("Judul Berhasil Diperbarui!", {
        description: `Pertemuan ${nomorPertemuan} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const msg: string =
        (typeof data === "string" ? data : null) ??
        data?.message ??
        data?.error ??
        err?.message ??
        "Terjadi kesalahan saat memperbarui judul.";
      const msgLower = msg.toLowerCase();

      let title = "Gagal Memperbarui Judul!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("not found") || msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Pertemuan Tidak Ditemukan!";
        description = "Data pertemuan tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat memperbarui judul.") {
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
          <DialogTitle>Edit Judul Pertemuan {nomorPertemuan}</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Input
            placeholder="Judul pertemuan..."
            value={judul}
            onChange={(e) => setJudul(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
            autoFocus
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button
            onClick={submit}
            disabled={loading || !judul.trim()}
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}