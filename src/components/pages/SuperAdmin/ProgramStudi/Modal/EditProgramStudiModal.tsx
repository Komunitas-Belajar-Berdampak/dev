import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Icon } from "@iconify/react";

import type { ProgramStudiEntity } from "../types/program-studi";
import { useUpdateProgramStudi } from "../hooks/useUpdateProgramStudi";
import { useFakultasOptions } from "../hooks/useFakultasOptions";

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().trim();
}

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function EditProgramStudiModal({
  open,
  onClose,
  data,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  data: ProgramStudiEntity | null;
  onSuccess?: () => void;
}) {
  const { updateProgramStudi, loading } = useUpdateProgramStudi();
  const { options: fakultasOptions, loading: loadingFakultas, fakultas } = useFakultasOptions();

  const [namaProdi, setNamaProdi] = useState("");
  const [idFakultas, setIdFakultas] = useState("");

  useEffect(() => {
    if (!open || !data) return;

    setNamaProdi(data.namaProdi ?? "");

    const rawId =
      (data as any).idFakultas ??
      (data as any).facultyId ??
      (data as any).fakultasId ??
      "";

    if (rawId) {
      setIdFakultas(String(rawId));
      return;
    }

    const currentName = norm((data as any).namaFakultas);
    if (!currentName) { setIdFakultas(""); return; }

    const match = (fakultas ?? []).find((f: any) => norm(f.namaFakultas ?? f.nama) === currentName);
    setIdFakultas(match ? String(match._id ?? match.id) : "");
  }, [open, data?.id, fakultas]);

  const disabled = useMemo(
    () => !data || loading || loadingFakultas || !namaProdi.trim() || !idFakultas,
    [data, loading, loadingFakultas, namaProdi, idFakultas],
  );

  const submit = async () => {
    if (!data) return;

    const nama = namaProdi.trim();

    if (!nama) {
      toast.error("Nama Program Studi Wajib Diisi!", {
        description: "Silakan isi nama program studi sebelum melanjutkan.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!idFakultas) {
      toast.error("Fakultas Wajib Dipilih!", {
        description: "Silakan pilih fakultas untuk program studi ini.",
        icon: errorIcon, style: errorStyle, descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await updateProgramStudi({ id: data.id, payload: { namaProdi: nama, idFakultas } });
      onSuccess?.();
      onClose();

      toast.success("Program Studi Berhasil Diperbarui!", {
        description: `Program studi ${nama} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg: string =
        err?.response?.data?.message ??
        err?.message ??
        "Terjadi kesalahan saat memperbarui program studi.";

      const msgLower = msg.toLowerCase();
      let title = "Gagal Memperbarui Program Studi!";
      let description = msg;

      if (msgLower.includes("nama") || (msgLower.includes("duplicate") && msgLower.includes("nama"))) {
        title = "Nama Program Studi Sudah Terdaftar!";
        description = `Nama ${nama} sudah terdaftar di sistem.`;
      } else if (msgLower.includes("duplicate") || msgLower.includes("already") || msgLower.includes("sudah")) {
        title = "Data Sudah Terdaftar!";
        description = "Nama program studi sudah terdaftar di sistem.";
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
      <DialogContent className="max-w-3xl w-[calc(100%-2rem)] sm:w-full rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Program Studi</DialogTitle>
          <p className="text-sm text-muted-foreground">Silahkan ubah data Program Studi!</p>
        </DialogHeader>

        {!data ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data...</div>
        ) : (
          <>
            <div className="space-y-4 mt-4">
              <Input
                value={data.kodeProdi}
                readOnly
                className="bg-muted cursor-not-allowed opacity-70"
              />
              <Input
                value={namaProdi}
                onChange={(e) => setNamaProdi(e.target.value)}
                placeholder="Nama Program Studi"
              />
              <Select value={idFakultas} onValueChange={setIdFakultas}>
                <SelectTrigger className="w-full border border-black/20">
                  <SelectValue placeholder={loadingFakultas ? "Memuat fakultas..." : "Pilih Fakultas"} />
                </SelectTrigger>
                <SelectContent>
                  {fakultasOptions.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Tidak ada data fakultas</div>
                  ) : (
                    fakultasOptions.map((f) => (
                      <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-6" onClick={submit} disabled={disabled}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}