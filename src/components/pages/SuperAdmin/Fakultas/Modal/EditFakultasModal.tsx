import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditFakultasModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
  fakultas?: any | null;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Fakultas</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan masukkan data Fakultas yang ingin diubah
          </p>
        </DialogHeader>

        {/* FORM */}
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* NIK */}
          <Field label="Kode Fakultas">
            <Input placeholder="072" disabled/>
          </Field>

          {/* Nama */}
          <Field label="Nama Fakultas">
            <Input placeholder="Fakultas Teknologi dan Rekayasa Cerdas" />
          </Field>
        </div>

        {/* ACTION */}
        <div className="pt-8">
          <Button className="w-full md:w-1/2">
            Edit Data Fakultas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}
