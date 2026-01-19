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

export default function AddProgramStudiModal({
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
          <DialogTitle>Add Program Studi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input placeholder="Kode Program Studi" />
          <Input placeholder="Nama Program Studi" />

          <Select>
            <SelectTrigger className="w-full border border-black/20">
              <SelectValue placeholder="Pilih Fakultas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="f1">
                Fakultas Teknologi dan Rekayasa Cerdas
              </SelectItem>
              <SelectItem value="f2">
                Fakultas Hukum dan Bisnis Digital
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full mt-6">
          Tambah Program Studi
        </Button>
      </DialogContent>
    </Dialog>
  );
}
