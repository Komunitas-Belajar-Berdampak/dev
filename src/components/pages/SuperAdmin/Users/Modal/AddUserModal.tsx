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
import ImportUserModal from "./ImportUserModal";

import type { CreateUserPayload, JenisKelamin, UserStatusBE } from "../types/user";

// ─── Avatar SVG ──────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type Tab = "manual" | "import";

// ─── Initial state ────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const errorIcon = (
  <Icon
    icon="lets-icons:check-fill"
    className="text-white text-lg shrink-0 mt-0.5 rotate-45"
  />
);

const errorStyle = {
  background: "#dc2626",
  color: "#ffffff",
  border: "none",
  alignItems: "flex-start",
};

const successStyle = {
  background: "#16a34a",
  color: "#ffffff",
  border: "none",
  alignItems: "flex-start",
};

const successIcon = (
  <Icon
    icon="lets-icons:check-fill"
    className="text-white text-lg shrink-0 mt-0.5"
  />
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddUserModal({ open, onClose, onSuccess }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("manual");

  const { createUser, loading } = useCreateUser();
  const { programStudi, loading: loadingProdi } = useProgramStudi();
  const { roles, loading: loadingRoles } = useRoles();

  const [form, setForm] = useState<CreateUserPayload>(initialForm);
  const [preview, setPreview] = useState<string>(baldAvatarSvg);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Auto-set first role when roles load
  useEffect(() => {
    if (!open) return;
    if (!form.idRole && roles.length) {
      setForm((p) => ({ ...p, idRole: roles[0].id }));
    }
  }, [open, roles, form.idRole]);

  // Reset form on close
  useEffect(() => {
    if (!open) {
      setForm(initialForm);
      setPreview(baldAvatarSvg);
      setActiveTab("manual");
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
    setPreview(URL.createObjectURL(file));
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
        icon: successIcon,
        style: successStyle,
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

      if (
        msgLower.includes("nrp") ||
        (msgLower.includes("duplicate") && msgLower.includes("nrp"))
      ) {
        title = "NRP Sudah Terdaftar!";
        description = `NRP ${nrpTrim} sudah digunakan. Gunakan NRP yang berbeda.`;
      } else if (msgLower.includes("email")) {
        title = "Email Sudah Terdaftar!";
        description = `Email ${form.email} sudah digunakan. Gunakan email yang berbeda.`;
      } else if (
        msgLower.includes("duplicate") ||
        msgLower.includes("already") ||
        msgLower.includes("sudah")
      ) {
        title = "Data Sudah Terdaftar!";
        description = "Beberapa data yang dimasukkan sudah terdaftar di sistem.";
      } else if (
        msgLower.includes("validation") ||
        msgLower.includes("invalid")
      ) {
        title = "Data Tidak Valid!";
        description = msg;
      } else if (
        msgLower.includes("network") ||
        msgLower.includes("timeout") ||
        msgLower.includes("econnrefused")
      ) {
        title = "Koneksi Bermasalah!";
        description =
          "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
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
    <>
      {/* ── Manual Input Dialog ── */}
      <Dialog
        open={open && activeTab === "manual"}
        onOpenChange={(v) => {
          if (!v) onClose();
        }}
      >
        {/* ✅ max-w-5xl — lebih lebar, nyaman di laptop M */}
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Tambah User</DialogTitle>
          </DialogHeader>

          {/* ── Tab Switcher ── */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
            <TabButton
              active={activeTab === "manual"}
              icon="mdi:account-plus"
              label="Input Manual"
              onClick={() => setActiveTab("manual")}
            />
            <TabButton
              active={activeTab === "import"}
              icon="mdi:file-excel"
              label="Import Excel / CSV"
              onClick={() => setActiveTab("import")}
            />
          </div>

          {/* ── Avatar Upload ── */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <img
              src={preview}
              alt="profile"
              className="w-24 h-24 rounded-full object-cover bg-gray-200 border border-gray-200"
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={pickFile}
            >
              Upload Profile Picture
            </Button>
          </div>

          {/* ✅ Grid 3 kolom */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
            <Field label="NRP">
              <Input
                value={form.nrp}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nrp: e.target.value }))
                }
                placeholder="2272001"
              />
            </Field>

            <Field label="Nama Lengkap">
              <Input
                value={form.nama}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nama: e.target.value }))
                }
                placeholder="Nama"
              />
            </Field>

            <Field label="Angkatan">
              <Input
                value={form.angkatan}
                onChange={(e) =>
                  setForm((p) => ({ ...p, angkatan: e.target.value }))
                }
                placeholder="2022"
              />
            </Field>

            <Field label="Program Studi">
              <Select
                value={form.idProdi}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, idProdi: v }))
                }
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  {(programStudi ?? []).map((p: any) => {
                    const id = String(p._id ?? p.id ?? "");
                    const label = String(
                      p.namaProdi ?? p.namaProgramStudi ?? "-"
                    );
                    if (!id) return null;
                    return (
                      <SelectItem key={id} value={id}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Email">
              <Input
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@kampus.ac.id"
              />
            </Field>

            <Field label="Alamat" optional>
              <Input
                value={form.alamat ?? ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, alamat: e.target.value }))
                }
                placeholder="Jl. ..."
              />
            </Field>

            <Field label="Jenis Kelamin">
              <Select
                value={form.jenisKelamin}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, jenisKelamin: v as JenisKelamin }))
                }
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
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as UserStatusBE }))
                }
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
              <Select
                value={form.idRole}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, idRole: v }))
                }
              >
                <SelectTrigger className="w-full h-10">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  {(roles ?? []).map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            *Password default akan disamakan dengan NRP dan disarankan untuk
            diganti saat login pertama.
          </p>

          <div className="pt-4">
            <Button
              className="w-full md:w-auto"
              type="button"
              onClick={submit}
              disabled={disabled}
            >
              {loading ? "Menyimpan..." : "Tambah Data User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Import Dialog ── */}
      <ImportUserModal
        open={open && activeTab === "import"}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
        active
          ? "bg-white shadow-sm text-blue-700 border border-blue-100"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon
        icon={icon}
        className={active ? "text-blue-600" : "text-gray-400"}
      />
      {label}
    </button>
  );
}

function Field({
  label,
  children,
  optional = false,
}: {
  label: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}{" "}
        {optional ? (
          <span className="text-muted-foreground font-normal text-xs">
            (opsional)
          </span>
        ) : (
          <span className="text-red-500">*</span>
        )}
      </label>
      {children}
    </div>
  );
}