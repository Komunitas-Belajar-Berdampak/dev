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
import type { ProgramStudi } from "../types/program-studi";

export default function EditProgramStudiModal({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: ProgramStudi | null;
}) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Program Studi</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input value={data.kodeProgramStudi} disabled />
          <Input defaultValue={data.namaProgramStudi} />

          <Select defaultValue={data.idFakultas}>
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
          Simpan Perubahan
        </Button>
      </DialogContent>
    </Dialog>
  );
}
