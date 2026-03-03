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
  lampiran: string;
  status: "HIDE" | "VISIBLE";
};

type Props = {
  open: boolean;
  mode: "add" | "edit";
  kodeMatkul?: string;
  pertemuan?: number;
  initial?: {
    judul?: string;
    deskripsi?: string;
    lampiran?: string;
    endDate?: string;
    endTime?: string;
    statusTugas?: boolean;
    status?: "HIDE" | "VISIBLE";
  } | null;
  onClose: () => void;
  onSubmit: (payload: AssignmentFormPayload) => void;
};

export default function AssignmentModal({
  open,
  mode,
  kodeMatkul,
  pertemuan,
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
  const [pathLampiran, setPathLampiran] = useState("");
  const [fileName, setFileName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:30");
  const [status, setStatus] = useState<"HIDE" | "VISIBLE">("VISIBLE");
  const [statusTugas, setStatusTugas] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setJudul(initial?.judul ?? "");
    setDeskripsi(initial?.deskripsi ?? "");
    setPathLampiran(initial?.lampiran ?? "");
    setFileName("");
    setEndDate(initial?.endDate ?? "");
    setEndTime(initial?.endTime ?? "10:30");
    setStatus(initial?.status ?? "VISIBLE");
    setStatusTugas(initial?.statusTugas ?? false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [open, initial]);

  const generateLampiran = (nama: string) => {
    if (!kodeMatkul || !pertemuan || !nama) return "";
    const meetPad = `meet${String(pertemuan).padStart(2, "0")}`;
    return `assignments/${kodeMatkul}/${meetPad}/${nama}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    setPathLampiran(generateLampiran(f.name));
  };

  const handleSubmit = () => {
    const tenggat =
      endDate && endTime
        ? new Date(`${endDate}T${endTime}:00`).toISOString()
        : "";
    onSubmit({ judul, statusTugas, tenggat, deskripsi, lampiran: pathLampiran, status });
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
              onChange={(e) => setJudul(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              File Lampiran{" "}
              {mode === "add" && <span className="text-red-500">*</span>}
            </label>
            {mode === "edit" && initial?.lampiran && (
              <p className="text-xs text-gray-500">
                File saat ini:{" "}
                <span className="font-semibold">
                  {initial.lampiran.split("/").pop()}
                </span>
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
                Dipilih: <span className="font-medium">{fileName}</span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Path Lampiran{" "}
              <span className="text-xs font-normal text-gray-400">
                (auto-generate)
              </span>
            </label>
            <Input
              placeholder="Otomatis terisi setelah pilih file"
              value={pathLampiran}
              onChange={(e) => setPathLampiran(e.target.value)}
              className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-600"
            />
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
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
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
                <label key={v} className="flex items-center gap-2 cursor-pointer">
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