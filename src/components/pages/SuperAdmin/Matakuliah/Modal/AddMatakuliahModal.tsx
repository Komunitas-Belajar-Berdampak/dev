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
import { Textarea } from "@/components/ui/textarea";

export default function AddMatakuliahModal({
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
          <DialogTitle>Add Matakuliah</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input placeholder="Kode Matakuliah" />
          <Input placeholder="Nama Matakuliah" />
          <Input type="number" placeholder="SKS" />
          <Input placeholder="Kelas" />

          <Select>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p1">
                2025/2026 - Ganjil - Semester 7
              </SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Pilih Pengajar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d1">Dr. Andi Wijaya</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <Textarea placeholder="Deskripsi (opsional)" />
        </div>

        <Button className="w-full mt-6">Tambah Matakuliah</Button>
      </DialogContent>
    </Dialog>
  );
}
