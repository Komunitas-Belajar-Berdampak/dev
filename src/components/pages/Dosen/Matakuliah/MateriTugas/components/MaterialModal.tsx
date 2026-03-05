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

type FieldErrors = {
  namaFile?: string;
  pathFile?: string;
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
  const [errors, setErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    // Semua field diisi dari data existing — termasuk deskripsi
    setNamaFile(initial?.namaFile ?? "");
    setTipe(initial?.tipe ?? "");
    setPathFile(initial?.pathFile ?? "");
    setVisibility(initial?.visibility ?? "VISIBLE");
    setDeskripsi(initial?.deskripsi ?? "");
    setFileName("");
    setErrors({});
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
    setFileName(f.name);
    setNamaFile(f.name);
    setTipe(f.type);
    setPathFile(generated);
    setErrors((prev) => ({ ...prev, namaFile: undefined, pathFile: undefined }));
  };

  const handleNamaFileChange = (val: string) => {
    setNamaFile(val);
    setPathFile(generatePathFile(val));
    if (val.trim()) setErrors((prev) => ({ ...prev, namaFile: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!namaFile.trim()) newErrors.namaFile = "Nama file wajib diisi.";
    if (!pathFile.trim()) newErrors.pathFile = "Path file wajib diisi. Pilih file terlebih dahulu.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ namaFile, tipe, pathFile, visibility, deskripsi });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Upload File */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Upload File{" "}
              {mode === "add" && <span className="text-red-500">*</span>}
            </label>

            {/* Tampilkan file existing saat edit dan belum ganti file */}
            {mode === "edit" && (initial?.namaFile || namaFile) && !fileName && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Icon icon="mdi:file-document-outline" className="text-blue-900 shrink-0" />
                <span className="text-xs text-gray-600">
                  File saat ini:{" "}
                  <span className="font-semibold text-gray-800">
                    {initial?.namaFile ?? namaFile}
                  </span>
                </span>
              </div>
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
                {tipe && <span className="text-gray-400">({tipe})</span>}
              </p>
            )}

            {mode === "edit" && (
              <p className="text-xs text-gray-400">
                Biarkan kosong jika tidak ingin mengganti file.
              </p>
            )}
          </div>

          {/* Nama File */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Nama File <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Otomatis terisi dari file yang dipilih"
              value={namaFile}
              onChange={(e) => handleNamaFileChange(e.target.value)}
              className={[
                "border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                errors.namaFile ? "border-red-500 focus:border-red-500" : "border-black",
              ].join(" ")}
            />
            {errors.namaFile && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <Icon icon="mdi:alert-circle-outline" className="shrink-0" />
                {errors.namaFile}
              </p>
            )}
          </div>

          {/* Tipe File */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Tipe File</label>
            <Input
              placeholder="Otomatis terisi dari file yang dipilih"
              value={tipe}
              onChange={(e) => setTipe(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Path File */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Path File{" "}
              <span className="text-xs font-normal text-gray-400">(auto-generate)</span>
            </label>
            <Input
              placeholder="Otomatis terisi setelah pilih file"
              value={pathFile}
              onChange={(e) => {
                setPathFile(e.target.value);
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, pathFile: undefined }));
              }}
              className={[
                "border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-600",
                errors.pathFile ? "border-red-500 focus:border-red-500" : "border-black",
              ].join(" ")}
            />
            {errors.pathFile && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <Icon icon="mdi:alert-circle-outline" className="shrink-0" />
                {errors.pathFile}
              </p>
            )}
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
              onClick={handleSubmit}
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