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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan masukkan data user baru
          </p>
        </DialogHeader>

        {/* PROFILE */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <img
            src="https://i.pravatar.cc/120"
            alt="profile"
            className="w-24 h-24 rounded-full object-cover"
          />
          <Button variant="outline" size="sm">
            Upload Profile Picture
          </Button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* NIK */}
          <Field label="NIK / NRP">
            <Input placeholder="2272028" />
          </Field>

          {/* Nama */}
          <Field label="Nama Lengkap">
            <Input placeholder="Nathaniel Valentino" />
          </Field>

          {/* Angkatan */}
          <Field label="Angkatan">
            <Input placeholder="2022" />
          </Field>

          {/* Prodi */}
          <Field label="Program Studi">
            <Select>
              <SelectTrigger
                className="w-full
                            h-10
                            rounded-md
                            border border-input
                            bg-background
                            px-3 py-2
                            text-sm
                            ring-offset-background
                            focus:outline-none
                            focus:ring-2
                            focus:ring-ring
                            focus:ring-offset-2">
                <SelectValue placeholder="Pilih Program Studi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ti">Teknik Informatika</SelectItem>
                <SelectItem value="si">Sistem Informasi</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Email */}
          <Field label="Email">
            <Input placeholder="2272028@maranatha.ac.id" />
          </Field>

          {/* Alamat */}
          <Field label="Alamat">
            <Input placeholder="Jl. Sukarya 4" />
          </Field>

          {/* Gender */}
          <Field label="Jenis Kelamin">
            <Select>
              <SelectTrigger
              className="w-full
                            h-10
                            rounded-md
                            border border-input
                            bg-background
                            px-3 py-2
                            text-sm
                            ring-offset-background
                            focus:outline-none
                            focus:ring-2
                            focus:ring-ring
                            focus:ring-offset-2">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laki">Laki-Laki</SelectItem>
                <SelectItem value="perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Status */}
          <Field label="Status">
            <Select>
              <SelectTrigger
              className="w-full
                            h-10
                            rounded-md
                            border border-input
                            bg-background
                            px-3 py-2
                            text-sm
                            ring-offset-background
                            focus:outline-none
                            focus:ring-2
                            focus:ring-ring
                            focus:ring-offset-2">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Non Aktif</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {/* Role */}
          <Field label="Role">
            <Select>
              <SelectTrigger
              className="w-full
                            h-10
                            rounded-md
                            border border-input
                            bg-background
                            px-3 py-2
                            text-sm
                            ring-offset-background
                            focus:outline-none
                            focus:ring-2
                            focus:ring-ring
                            focus:ring-offset-2">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                <SelectItem value="dosen">Dosen</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* ACTION */}
        <div className="pt-8">
          <Button className="w-full md:w-1/3">
            Tambah Data User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* =======================
   REUSABLE FIELD WRAPPER
======================= */
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
