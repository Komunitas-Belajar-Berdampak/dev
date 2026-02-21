import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@iconify/react";

type MaterialForm = {
  namaFile: string;
  file?: File | null;
  deskripsi: string;
};

export default function MaterialModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "add" | "edit";
  initial?: { judul?: string; deskripsi?: string; namaFile?: string } | null;
  onClose: () => void;
  onSubmit: (payload: MaterialForm) => void;
}) {
  const title = useMemo(
    () => (mode === "add" ? "Tambah Materi" : "Edit Materi"),
    [mode]
  );

  const [namaFile, setNamaFile] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!open) return;
    setNamaFile(initial?.judul ?? "");
    setDeskripsi(initial?.deskripsi ?? "");
    setFile(null);
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Judul Materi<span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Masukkan judul materi"
              value={namaFile}
              onChange={(e) => setNamaFile(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              File Materi<span className="text-red-500">*</span>
            </label>

            {mode === "edit" && initial?.namaFile && (
              <div className="text-xs text-gray-600">
                File saat ini: <span className="font-semibold">{initial.namaFile}</span>
              </div>
            )}

            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Deskripsi Materi
            </label>
            <Textarea
              placeholder="Masukkan deskripsi materi (opsional)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="min-h-[160px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-2 border-black"
            >
              Batal
            </Button>

            <Button
              type="button"
              onClick={() => onSubmit({ namaFile, file, deskripsi })}
              className="
                inline-flex items-center gap-2
                rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white
                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                transition-all duration-150
                hover:translate-x-[1px] hover:translate-y-[1px]
                hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                active:translate-x-[2px] active:translate-y-[2px]
                active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
              "
            >
              <Icon icon="mdi:content-save" className="text-base" />
              {mode === "add" ? "Tambah Materi" : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}