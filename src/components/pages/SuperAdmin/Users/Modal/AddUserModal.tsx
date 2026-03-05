import { useEffect, useMemo, useRef, useState } from "react";
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

import { toast } from "sonner";
import { Icon } from "@iconify/react";
import { useCreateUser } from "../hooks/useCreateUser";
import { useProgramStudi } from "../../ProgramStudi/hooks/useProgramStudi";
import { useRoles } from "../hooks/useRoles";

import type { CreateUserPayload, JenisKelamin, UserStatusBE } from "../types/user";

const baldAvatarSvg = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
  <rect width="120" height="120" rx="60" fill="#e5e7eb"/>
  <circle cx="60" cy="52" r="28" fill="#f5d0a9"/>
  <rect x="34" y="78" width="52" height="28" rx="14" fill="#f5d0a9"/>
  <circle cx="50" cy="52" r="4" fill="#111827"/>
  <circle cx="70" cy="52" r="4" fill="#111827"/>
  <path d="M50 64c6 6 14 6 20 0" stroke="#111827" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>
`)}`;

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const initialForm: CreateUserPayload = {
  nrp: "",
  idRole: "",
  idProdi: "",
  nama: "",
  angkatan: "",
  email: "",
  alamat: "",
  jenisKelamin: "pria",
  status: "aktif",
  password: "",
  fotoProfil: "",
};

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

export default function AddUserModal({ open, onClose, onSuccess }: Props) {
  const { createUser, loading } = useCreateUser();
  const { programStudi, loading: loadingProdi } = useProgramStudi();
  const { roles, loading: loadingRoles } = useRoles();

  const [form, setForm] = useState<CreateUserPayload>(initialForm);
  const [preview, setPreview] = useState<string>(baldAvatarSvg);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    if (!form.idRole && roles.length) {
      setForm((p) => ({ ...p, idRole: roles[0].id }));
    }
  }, [open, roles, form.idRole]);

  // reset form saat modal ditutup
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setPreview(baldAvatarSvg);
    }
  }, [open]);

  const disabled = useMemo(() => {
    return (
      loading ||
      loadingProdi ||
      loadingRoles ||
      !form.nrp ||
      !form.nama ||
      !form.angkatan ||
      !form.email ||
      !form.idProdi ||
      !form.idRole ||
      !form.jenisKelamin ||
      !form.status
    );
  }, [form, loading, loadingProdi, loadingRoles]);

  const pickFile = () => fileRef.current?.click();

  const onFileChange = async (file: File | null) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, fotoProfil: dataUrl }));
  };

  const submit = async () => {
    const nrpTrim = form.nrp.trim();

    if (!nrpTrim) {
      toast.error("NRP Wajib Diisi!", {
        description: "Silakan isi NRP sebelum melanjutkan.",
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!form.idRole) {
      toast.error("Role Wajib Dipilih!", {
        description: "Silakan pilih role untuk user ini.",
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
      return;
    }
    if (!form.idProdi) {
      toast.error("Program Studi Wajib Dipilih!", {
        description: "Silakan pilih program studi untuk user ini.",
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
      return;
    }

    try {
      await createUser({
        ...form,
        password: nrpTrim,
        alamat: form.alamat?.trim() ? form.alamat : undefined,
        fotoProfil: form.fotoProfil?.trim() ? form.fotoProfil : "",
      });

      onSuccess?.();
      onClose();

      toast.success("User Berhasil Ditambahkan!", {
        description: `Data user ${form.nama} dengan NRP ${nrpTrim} berhasil disimpan.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } catch (err: any) {
      const msg: string =
        err?.response?.data?.message ??
        err?.message ??
        "Terjadi kesalahan saat menambahkan user.";

      const msgLower = msg.toLowerCase();
      let title = "Gagal Menambahkan User!";
      let description = msg;

      if (msgLower.includes("nrp") || (msgLower.includes("duplicate") && msgLower.includes("nrp"))) {
        title = "NRP Sudah Terdaftar!";
        description = `NRP ${nrpTrim} sudah digunakan. Gunakan NRP yang berbeda.`;
      } else if (msgLower.includes("email")) {
        title = "Email Sudah Terdaftar!";
        description = `Email ${form.email} sudah digunakan. Gunakan email yang berbeda.`;
      } else if (msgLower.includes("duplicate") || msgLower.includes("already") || msgLower.includes("sudah")) {
        title = "Data Sudah Terdaftar!";
        description = "Beberapa data yang dimasukkan sudah terdaftar di sistem.";
      } else if (msgLower.includes("validation") || msgLower.includes("invalid")) {
        title = "Data Tidak Valid!";
        description = msg;
      } else if (msgLower.includes("network") || msgLower.includes("timeout") || msgLower.includes("econnrefused")) {
        title = "Koneksi Bermasalah!";
        description = "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
      }

      toast.error(title, {
        description,
        icon: errorIcon,
        style: errorStyle,
        descriptionClassName: "!text-white/90",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 mt-2">
          <img
            src={preview}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover bg-gray-200"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
          />
          <Button variant="outline" size="sm" type="button" onClick={pickFile}>
            Upload Profile Picture
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Field label="NRP">
            <Input
              value={form.nrp}
              onChange={(e) => setForm((p) => ({ ...p, nrp: e.target.value }))}
              placeholder="2272001"
            />
          </Field>

          <Field label="Nama Lengkap">
            <Input
              value={form.nama}
              onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
              placeholder="Nama"
            />
          </Field>

          <Field label="Angkatan">
            <Input
              value={form.angkatan}
              onChange={(e) => setForm((p) => ({ ...p, angkatan: e.target.value }))}
              placeholder="2022"
            />
          </Field>

          <Field label="Program Studi">
            <Select value={form.idProdi} onValueChange={(v) => setForm((p) => ({ ...p, idProdi: v }))}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Program Studi" />
              </SelectTrigger>
              <SelectContent>
                {(programStudi ?? []).map((p: any) => {
                  const id = String(p._id ?? p.id ?? "");
                  const label = String(p.namaProdi ?? p.namaProgramStudi ?? "-");
                  if (!id) return null;
                  return <SelectItem key={id} value={id}>{label}</SelectItem>;
                })}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Email">
            <Input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="email@kampus.ac.id"
            />
          </Field>

          <Field label="Alamat">
            <Input
              value={form.alamat ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, alamat: e.target.value }))}
              placeholder="Jl. ..."
            />
          </Field>

          <Field label="Jenis Kelamin">
            <Select
              value={form.jenisKelamin}
              onValueChange={(v) => setForm((p) => ({ ...p, jenisKelamin: v as JenisKelamin }))}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pria">Pria</SelectItem>
                <SelectItem value="wanita">Wanita</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Status">
            <Select
              value={form.status}
              onValueChange={(v) => setForm((p) => ({ ...p, status: v as UserStatusBE }))}
            >
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="Role">
            <Select value={form.idRole} onValueChange={(v) => setForm((p) => ({ ...p, idRole: v }))}>
              <SelectTrigger className="w-full h-10">
                <SelectValue placeholder="Pilih Role" />
              </SelectTrigger>
              <SelectContent>
                {(roles ?? []).map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          *Password default akan disamakan dengan NRP dan disarankan untuk diganti saat login pertama.
        </p>

        <div className="pt-6">
          <Button className="w-full md:w-1/3" type="button" onClick={submit} disabled={disabled}>
            {loading ? "Menyimpan..." : "Tambah Data User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      {children}
    </div>
  );
}