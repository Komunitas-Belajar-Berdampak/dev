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

import type { Matakuliah } from "../types/matakuliah";

interface Props {
  open: boolean;
  onClose: () => void;
  data: Matakuliah | null;
}

export default function EditMatakuliahModal({
  open,
  onClose,
  data,
}: Props) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Matakuliah</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* READ ONLY */}
          <Input value={data.kodeMatkul} disabled />
          
          <Input defaultValue={data.namaMatkul} />
          <Input type="number" defaultValue={data.sks} />
          <Input defaultValue={data.kelas} />

          <Select defaultValue={data.idPeriode}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="p1">
                2025/2026 - Ganjil - Semester 7
              </SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue={data.idPengajar}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="d1">Dr. Andi Wijaya</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue={data.status}>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
            </SelectContent>
          </Select>

          <Textarea
            defaultValue={data.deskripsi}
            placeholder="Deskripsi (opsional)"
          />
        </div>

        <Button className="w-full mt-6">
          Simpan Perubahan
        </Button>
      </DialogContent>
    </Dialog>
  );
}
