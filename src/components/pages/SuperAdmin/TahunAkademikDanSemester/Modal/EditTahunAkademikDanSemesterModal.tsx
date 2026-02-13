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
import type { TahunAkademikDanSemesterEntity } from "../types/tahun-akademik-dan-semester";

export default function EditTahunAkademikDanSemesterModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: TahunAkademikDanSemesterEntity | null;
}) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tahun Akademik & Semester</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input defaultValue={data.periode} />
          <Input type="date" defaultValue={data.startDate} />
          <Input type="date" defaultValue={data.endDate} />

          <Select defaultValue={data.status}>
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
          Simpan Perubahan
        </Button>
      </DialogContent>
    </Dialog>
  );
}
