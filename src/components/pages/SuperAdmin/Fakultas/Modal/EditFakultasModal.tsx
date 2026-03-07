import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import { useUpdateFakultas } from "../hooks/useUpdateFakultas";
import type { FakultasEntity } from "../types/fakultas";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function EditFakultasModal({
  open,
  onClose,
  fakultas,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  fakultas: FakultasEntity | null;
  onSuccess?: () => void;
}) {
  const { updateFakultas, loading } = useUpdateFakultas();

  const [kodeFakultas, setKodeFakultas] = useState("");
  const [namaFakultas, setNamaFakultas] = useState("");

  useEffect(() => {
    if (!open || !fakultas) return;
    setKodeFakultas(fakultas.kodeFakultas ?? "");
    setNamaFakultas(fakultas.namaFakultas ?? "");
  }, [open, fakultas?.id]);

  const disabled = useMemo(
    () => loading || !namaFakultas.trim(),
    [loading, namaFakultas],
  );

  const submit = async () => {
    if (!fakultas) return;

    const nama = namaFakultas.trim();
    if (!nama) {
      toast.error("Nama Fakultas Wajib Diisi!", {
        description: "Silakan isi nama fakultas sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await updateFakultas({ id: fakultas.id, payload: { namaFakultas: nama } });
      onSuccess?.();
      onClose();

      toast.success("Fakultas Berhasil Diperbarui!", {
        description: `Nama fakultas berhasil diubah menjadi ${nama}.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg: string =
        err?.response?.data?.message ??
        err?.message ??
        "Terjadi kesalahan saat memperbarui fakultas.";

      const msgLower = msg.toLowerCase();
      let title = "Gagal Memperbarui Fakultas!";
      let description = msg;

      if (msgLower.includes("nama") || (msgLower.includes("duplicate") && msgLower.includes("nama"))) {
        title = "Nama Fakultas Sudah Terdaftar!";
        description = `Nama ${nama} sudah terdaftar di sistem.`;
      } else if (msgLower.includes("duplicate") || msgLower.includes("already") || msgLower.includes("sudah")) {
        title = "Data Sudah Terdaftar!";
        description = "Nama fakultas sudah terdaftar di sistem.";
      } else if (msgLower.includes("network") || msgLower.includes("timeout")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Fakultas</DialogTitle>
          <p className="text-sm text-muted-foreground">Silahkan ubah data Fakultas!</p>
        </DialogHeader>

        {!fakultas ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data fakultas...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 mt-8">
              <Field label="Kode Fakultas">
                <Input
                  value={kodeFakultas}
                  readOnly
                  className="bg-muted cursor-not-allowed opacity-70"
                />
              </Field>

              <Field label="Nama Fakultas">
                <Input
                  value={namaFakultas}
                  onChange={(e) => setNamaFakultas(e.target.value)}
                />
              </Field>
            </div>

            <div className="pt-8">
              <Button className="w-full md:w-1/2" onClick={submit} disabled={disabled}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}