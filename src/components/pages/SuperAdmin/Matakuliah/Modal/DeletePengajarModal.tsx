import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import type { PengajarEntity } from "./AddPengajarModal";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function DeletePengajarModal({
  open,
  onClose,
  data,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  data: PengajarEntity | null;
  onConfirm: (id: string) => Promise<void> | void;
}) {
  const confirm = async () => {
    if (!data?.id) return;

    try {
      await onConfirm(data.id);
      onClose();

      toast.success("Pengajar Berhasil Dihapus!", {
        description: `${data.nama || "Pengajar"} berhasil dihapus dari matakuliah ini.`,
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
        "Terjadi kesalahan saat menghapus pengajar.";
      const msgLower = msg.toLowerCase();

      let title = "Gagal Menghapus Pengajar!";
      let description = "Terjadi kesalahan pada server. Silakan coba lagi.";

      if (msgLower.includes("not found") || msgLower.includes("tidak ditemukan") || err?.response?.status === 404) {
        title = "Pengajar Tidak Ditemukan!";
        description = "Data pengajar tidak ditemukan. Mungkin sudah dihapus sebelumnya.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("fetch")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      } else if (err?.response?.status >= 500) {
        title = "Terjadi Kesalahan Server!";
        description = "Server sedang bermasalah. Silakan coba beberapa saat lagi.";
      } else if (msg && msg !== "Terjadi kesalahan saat menghapus pengajar.") {
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
          <DialogTitle>Hapus Pengajar</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground mt-2">
          Yakin ingin menghapus{" "}
          <span className="font-semibold">{data?.nama ?? "pengajar ini"}</span>?
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