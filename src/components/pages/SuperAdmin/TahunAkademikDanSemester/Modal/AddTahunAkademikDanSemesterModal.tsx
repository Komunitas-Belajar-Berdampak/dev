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

export default function AddTahunAkademikDanSemesterModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tahun Akademik & Semester</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input placeholder="Periode (contoh: 2025/2026 - Ganjil - Semester 7)" />
          <Input type="date" placeholder="Tanggal Mulai" />
          <Input type="date" placeholder="Tanggal Selesai" />

          <Select>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full mt-6">
          Tambah Periode
        </Button>
      </DialogContent>
    </Dialog>
  );
}
