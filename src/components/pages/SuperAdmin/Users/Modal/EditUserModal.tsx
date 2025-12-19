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
import type { User } from "@/components/pages/SuperAdmin/Users/types/user";

interface Props {
  open: boolean;
  onClose: () => void;
  user?: User | null;
}

export default function EditUserModal({ open, onClose, user }: Props) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan masukkan data user yang ingin diubah
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
          {/* NIK / NRP (READ ONLY) */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              NIK / NRP <span className="text-red-500">*</span>
            </label>
            <Input value={user.nik} disabled />
          </div>

          {/* Nama */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <Input defaultValue={user.nama} />
          </div>

          {/* Angkatan */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Angkatan <span className="text-red-500">*</span>
            </label>
            <Input defaultValue={user.angkatan} />
          </div>

          {/* Program Studi */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Program Studi <span className="text-red-500">*</span>
            </label>
            <Select defaultValue="ti">
              <SelectTrigger
                className="
                  w-full h-10 rounded-md border border-input
                  bg-background px-3 py-2 text-sm
                  ring-offset-background
                  focus:outline-none focus:ring-2
                  focus:ring-ring focus:ring-offset-2
                "
              >
                <SelectValue placeholder={user.prodi} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ti">Teknik Informatika</SelectItem>
                <SelectItem value="si">Sistem Informasi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Email <span className="text-red-500">*</span>
            </label>
            <Input defaultValue="2272028@maranatha.ac.id" />
          </div>

          {/* Alamat */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Alamat <span className="text-red-500">*</span>
            </label>
            <Input defaultValue="Jl. Sukarya 4" />
          </div>

          {/* Jenis Kelamin */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <Select defaultValue="laki">
              <SelectTrigger
                className="
                  w-full h-10 rounded-md border border-input
                  bg-background px-3 py-2 text-sm
                  ring-offset-background
                  focus:outline-none focus:ring-2
                  focus:ring-ring focus:ring-offset-2
                "
              >
                <SelectValue placeholder="Laki-Laki" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="laki">Laki-Laki</SelectItem>
                <SelectItem value="perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </label>
            <Select
              defaultValue={user.status === "Aktif" ? "aktif" : "nonaktif"}
            >
              <SelectTrigger
                className="
                  w-full h-10 rounded-md border border-input
                  bg-background px-3 py-2 text-sm
                  ring-offset-background
                  focus:outline-none focus:ring-2
                  focus:ring-ring focus:ring-offset-2
                "
              >
                <SelectValue placeholder={user.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="nonaktif">Non Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Role <span className="text-red-500">*</span>
            </label>
            <Select defaultValue={user.role.toLowerCase()}>
              <SelectTrigger
                className="
                  w-full h-10 rounded-md border border-input
                  bg-background px-3 py-2 text-sm
                  ring-offset-background
                  focus:outline-none focus:ring-2
                  focus:ring-ring focus:ring-offset-2
                "
              >
                <SelectValue placeholder={user.role} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                <SelectItem value="dosen">Dosen</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ACTION */}
        <div className="pt-8">
          <Button className="w-full md:w-1/3">
            Edit Data User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
