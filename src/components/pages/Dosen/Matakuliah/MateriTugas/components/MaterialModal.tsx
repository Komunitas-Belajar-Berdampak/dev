import { useEffect, useMemo, useRef, useState } from "react";
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

export type MaterialFormPayload = {
  namaFile: string;
  tipe: string;
  pathFile: string;
  visibility: "HIDE" | "VISIBLE";
  deskripsi: string;
};

type Props = {
  open: boolean;
  mode: "add" | "edit";
  kodeMatkul?: string;
  pertemuan?: number;
  initial?: {
    namaFile?: string;
    tipe?: string;
    pathFile?: string;
    visibility?: "HIDE" | "VISIBLE";
    deskripsi?: string;
  } | null;
  onClose: () => void;
  onSubmit: (payload: MaterialFormPayload) => void;
};

export default function MaterialModal({
  open,
  mode,
  kodeMatkul,
  pertemuan,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const title = useMemo(
    () => (mode === "add" ? "Tambah Materi" : "Edit Materi"),
    [mode]
  );

  const [namaFile, setNamaFile] = useState("");
  const [tipe, setTipe] = useState("");
  const [pathFile, setPathFile] = useState("");
  const [visibility, setVisibility] = useState<"HIDE" | "VISIBLE">("VISIBLE");
  const [deskripsi, setDeskripsi] = useState("");
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setNamaFile(initial?.namaFile ?? "");
    setTipe(initial?.tipe ?? "");
    setPathFile(initial?.pathFile ?? "");
    setVisibility(initial?.visibility ?? "VISIBLE");
    setDeskripsi(initial?.deskripsi ?? "");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, initial]);

  const generatePathFile = (nama: string) => {
    if (!kodeMatkul || !pertemuan || !nama) return "";
    const meetPad = `meet${String(pertemuan).padStart(2, "0")}`;
    return `materials/${kodeMatkul}/${meetPad}/${nama}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const generated = generatePathFile(f.name);
    console.log("[MaterialModal] kodeMatkul:", kodeMatkul, "pertemuan:", pertemuan, "generated:", generated);

    setFileName(f.name);
    setNamaFile(f.name);
    setTipe(f.type);
    setPathFile(generated);
  };

  const handleNamaFileChange = (val: string) => {
    setNamaFile(val);
    setPathFile(generatePathFile(val));
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Upload File{" "}
              {mode === "add" && <span className="text-red-500">*</span>}
            </label>
            {mode === "edit" && initial?.namaFile && (
              <p className="text-xs text-gray-500">
                File saat ini:{" "}
                <span className="font-semibold">{initial.namaFile}</span>
              </p>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
            {fileName && (
              <p className="text-xs text-gray-500">
                Dipilih:{" "}
                <span className="font-medium">{fileName}</span>{" "}
                <span className="text-gray-400">({tipe})</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Nama File <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Otomatis terisi dari file yang dipilih"
              value={namaFile}
              onChange={(e) => handleNamaFileChange(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Tipe File</label>
            <Input
              placeholder="Otomatis terisi dari file yang dipilih"
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Path File{" "}
              <span className="text-xs font-normal text-gray-400">
                (auto-generate)
              </span>
            </label>
            <Input
              placeholder="Otomatis terisi setelah pilih file"
              value={pathFile}
              onChange={(e) => setPathFile(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-600"
            />
          </div>

          {/* Visibility */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Visibility</label>
            <div className="flex items-center gap-6">
              {(["VISIBLE", "HIDE"] as const).map((v) => (
                <label key={v} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="material-visibility"
                    value={v}
                    checked={visibility === v}
                    onChange={() => setVisibility(v)}
                    className="accent-blue-700"
                  />
                  <span className="text-sm text-blue-900">{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Deskripsi Materi
            </label>
            <Textarea
              placeholder="Masukkan deskripsi materi (opsional)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="min-h-[120px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Actions */}
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
              onClick={() =>
                onSubmit({ namaFile, tipe, pathFile, visibility, deskripsi })
              }
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