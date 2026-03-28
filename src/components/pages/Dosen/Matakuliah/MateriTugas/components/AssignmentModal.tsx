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

export type AssignmentFormPayload = {
  judul: string;
  statusTugas: boolean;
  tenggat: string;
  deskripsi: string;
  file?: File;                       // file asli — dikirim ke BE via FormData
  status: "HIDE" | "VISIBLE";
};

type Props = {
  open: boolean;
  mode: "add" | "edit";
  initial?: {
    judul?: string;
    deskripsi?: string;
    lampiranNama?: string;           // nama file lampiran existing (untuk tampilan saja)
    endDate?: string;
    endTime?: string;
    statusTugas?: boolean;
    status?: "HIDE" | "VISIBLE";
  } | null;
  onClose: () => void;
  onSubmit: (payload: AssignmentFormPayload) => void;
};

type FieldErrors = {
  judul?: string;
  endDate?: string;
};

export default function AssignmentModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const title = useMemo(
    () => (mode === "add" ? "Tambah Tugas" : "Edit Tugas"),
    [mode]
  );

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:30");
  const [status, setStatus] = useState<"HIDE" | "VISIBLE">("VISIBLE");
  const [statusTugas, setStatusTugas] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setJudul(initial?.judul ?? "");
    setDeskripsi(initial?.deskripsi ?? "");
    setSelectedFile(null);
    setEndDate(initial?.endDate ?? "");
    setEndTime(initial?.endTime ?? "10:30");
    setStatus(initial?.status ?? "VISIBLE");
    setStatusTugas(initial?.statusTugas ?? false);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, initial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setSelectedFile(f);
  };

  const validate = (): boolean => {
    const newErrors: FieldErrors = {};
    if (!judul.trim()) newErrors.judul = "Judul tugas wajib diisi.";
    if (!endDate.trim()) newErrors.endDate = "Tanggal tenggat wajib diisi.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const tenggat =
      endDate && endTime
        ? new Date(`${endDate}T${endTime}:00`).toISOString()
        : "";
    onSubmit({
      judul,
      statusTugas,
      tenggat,
      deskripsi,
      file: selectedFile ?? undefined,
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Judul */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Judul Tugas <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Masukkan judul tugas"
              value={judul}
              onChange={(e) => {
                setJudul(e.target.value);
                if (e.target.value.trim())
                  setErrors((prev) => ({ ...prev, judul: undefined }));
              }}
              className={[
                "border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                errors.judul
                  ? "border-red-500 focus:border-red-500"
                  : "border-black",
              ].join(" ")}
            />
            {errors.judul && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <Icon icon="mdi:alert-circle-outline" className="shrink-0" />
                {errors.judul}
              </p>
            )}
          </div>

          {/* File Lampiran */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              File Lampiran
            </label>

            {/* Tampilkan file existing saat edit dan belum ganti file */}
            {mode === "edit" && initial?.lampiranNama && !selectedFile && (
              <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <Icon
                  icon="mdi:paperclip"
                  className="text-blue-900 shrink-0"
                />
                <span className="text-xs text-gray-600">
                  File saat ini:{" "}
                  <span className="font-semibold text-gray-800">
                    {initial.lampiranNama}
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

            {selectedFile && (
              <p className="text-xs text-gray-500">
                Dipilih:{" "}
                <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}

            {mode === "edit" && (
              <p className="text-xs text-gray-400">
                Biarkan kosong jika tidak ingin mengganti file.
              </p>
            )}
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Deskripsi Tugas
            </label>
            <Textarea
              placeholder="Masukkan deskripsi tugas (opsional)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="min-h-[120px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {/* Tenggat */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Tenggat Pengumpulan <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-700">Tanggal</p>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    if (e.target.value.trim())
                      setErrors((prev) => ({ ...prev, endDate: undefined }));
                  }}
                  className={[
                    "border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    errors.endDate
                      ? "border-red-500 focus:border-red-500"
                      : "border-black",
                  ].join(" ")}
                />
                {errors.endDate && (
                  <p className="flex items-center gap-1 text-xs text-red-500">
                    <Icon
                      icon="mdi:alert-circle-outline"
                      className="shrink-0"
                    />
                    {errors.endDate}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-700">Jam</p>
                <Input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">Status</label>
            <div className="flex items-center gap-6">
              {(["VISIBLE", "HIDE"] as const).map((v) => (
                <label
                  key={v}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="assignment-status"
                    value={v}
                    checked={status === v}
                    onChange={() => setStatus(v)}
                    className="accent-blue-700"
                  />
                  <span className="text-sm text-blue-900">{v}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status Tugas */}
          <div className="flex items-center gap-3">
            <input
              id="statusTugas"
              type="checkbox"
              checked={statusTugas}
              onChange={(e) => setStatusTugas(e.target.checked)}
              className="h-4 w-4 accent-blue-700"
            />
            <label
              htmlFor="statusTugas"
              className="text-sm font-semibold text-blue-900 cursor-pointer"
            >
              Tugas Aktif
            </label>
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
              {mode === "add" ? "Tambah Tugas" : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}