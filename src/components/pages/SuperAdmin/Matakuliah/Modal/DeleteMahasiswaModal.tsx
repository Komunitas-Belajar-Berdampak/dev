    import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import type { MahasiswaEntity } from "./AddMahasiswaModal";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function DeleteMahasiswaModal({
  open,
  onClose,
  data,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  data: MahasiswaEntity | null;
  onConfirm: (id: string) => Promise<void> | void;
}) {
  const confirm = async () => {
    if (!data?.id) return;

    try {
      await onConfirm(data.id);
      onClose();

      toast.success("Mahasiswa Berhasil Dihapus!", {
        description: `${data.nama || "Mahasiswa"} berhasil dihapus dari matakuliah ini.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const data2 = err?.response?.data;
      const msg: string =
        (typeof data2 === "string" ? data2 : null) ??
        data2?.message ??
        data2?.error ??
        err?.message ??
        "Terjadi kesalahan saat menghapus mahasiswa.";
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menghapus Mahasiswa!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("not found") || msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Mahasiswa Tidak Ditemukan!";
        description = "Data mahasiswa tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menghapus mahasiswa.") {
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
          <DialogTitle>Hapus Mahasiswa</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Yakin ingin menghapus{" "}
          <span className="font-semibold">{data?.nama ?? "mahasiswa ini"}</span>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button variant="destructive" onClick={confirm} disabled={!data?.id}>
            Hapus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}