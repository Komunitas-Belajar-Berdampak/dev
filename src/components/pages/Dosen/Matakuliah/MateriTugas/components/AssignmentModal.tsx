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

type AssignmentForm = {
  judul: string;
  file?: File | null;
  deskripsi: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
};

export default function AssignmentModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "add" | "edit";
  initial?: {
    judul?: string;
    deskripsi?: string;
    namaFile?: string;
    startDate?: string;
    startTime?: string;
    endDate?: string;
    endTime?: string;
  } | null;
  onClose: () => void;
  onSubmit: (payload: AssignmentForm) => void;
}) {
  const title = useMemo(
    () => (mode === "add" ? "Tambah Tugas" : "Edit Tugas"),
    [mode]
  );

  const [judul, setJudul] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("10:30");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("10:30");

  useEffect(() => {
    if (!open) return;
    setJudul(initial?.judul ?? "");
    setDeskripsi(initial?.deskripsi ?? "");
    setFile(null);

    setStartDate(initial?.startDate ?? "");
    setStartTime(initial?.startTime ?? "10:30");
    setEndDate(initial?.endDate ?? "");
    setEndTime(initial?.endTime ?? "10:30");
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
              Judul Tugas<span className="text-red-500">*</span>
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
              File Tugas<span className="text-red-500">*</span>
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
              Deskripsi Tugas
            </label>
            <Textarea
              placeholder="Masukkan deskripsi tugas (opsional)"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="min-h-[160px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-900">
              Waktu Pengumpulan<span className="text-red-500">*</span>
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-end">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-700">Tanggal</p>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-700">Jam</p>
                <Input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>

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
                onSubmit({
                  judul,
                  file,
                  deskripsi,
                  startDate,
                  startTime,
                  endDate,
                  endTime,
                })
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
              {mode === "add" ? "Tambah Tugas" : "Simpan Perubahan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}