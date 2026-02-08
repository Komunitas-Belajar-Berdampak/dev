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

import { UsersService } from "../services/users.service";
import { useProgramStudi } from "../../ProgramStudi/hooks/useProgramStudi";
import { useRoles } from "../hooks/useRoles";
import { useUpdateUser } from "../hooks/useUpdateUser";

import type {
  JenisKelamin,
  UpdateUserPayload,
  UserEntity,
  UserStatusBE,
} from "@/components/pages/SuperAdmin/Users/types/user";

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

interface Props {
  open: boolean;
  userId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().trim();
}

export default function EditUserModal({ open, userId, onClose, onSuccess }: Props) {
  const { programStudi, loading: loadingProdi, error: errorProdi } =
    useProgramStudi();
  const { roles, loading: loadingRoles, error: errorRoles } = useRoles();
  const { updateUser, loading: saving, error: errorUpdate } = useUpdateUser();

  const [detail, setDetail] = useState<UserEntity | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [form, setForm] = useState<UpdateUserPayload>({
    idRole: "",
    idProdi: "",
    nama: "",
    angkatan: "",
    email: "",
    alamat: "",
    jenisKelamin: "pria",
    status: "aktif",
    fotoProfil: "",
  });

  const [preview, setPreview] = useState<string>(baldAvatarSvg);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open || !userId) return;

    setLoadingUser(true);
    setFetchError(null);
    setDetail(null);

    UsersService.getUserById(userId)
      .then((u) => {
        setDetail(u);

        // isi form cepat dari detail (tanpa nunggu roles)
        setForm({
          idRole: "", // di-resolve setelah roles ada
          idProdi: u.idProdi ?? "",
          nama: u.nama ?? "",
          angkatan: u.angkatan ?? "",
          email: u.email ?? "",
          alamat: u.alamat ?? "",
          jenisKelamin: (u.jenisKelamin ?? "pria") as JenisKelamin,
          status: (u.status ?? "aktif") as UserStatusBE,
          fotoProfil: u.fotoProfil ?? "",
        });

        setPreview(u.fotoProfil ? String(u.fotoProfil) : baldAvatarSvg);
      })
      .catch((e) => {
        const msg =
          e?.response?.data?.message ?? e?.message ?? "Gagal memuat data user";
        setFetchError(String(msg));
      })
      .finally(() => setLoadingUser(false));
  }, [open, userId]);

  useEffect(() => {
    if (!open || !detail) return;
    if (!roles?.length) return;

    const roleName = norm(detail.role); // detail.role biasanya string
    const roleId = roles.find((r) => norm(r.nama) === roleName)?.id ?? "";
    setForm((p) => ({ ...p, idRole: roleId }));
  }, [open, detail?._id, roles]);

  const combinedError =
    localError ?? fetchError ?? errorUpdate ?? errorProdi ?? errorRoles ?? null;

  const disabled = useMemo(() => {
    if (!detail) return true;
    if (loadingUser) return true;
    if (saving) return true;

    return (
      !form.nama?.trim() ||
      !form.angkatan?.trim() ||
      !form.email?.trim() ||
      !form.idProdi ||
      !form.idRole ||
      !form.jenisKelamin ||
      !form.status
    );
  }, [detail, loadingUser, saving, form]);

  const pickFile = () => fileRef.current?.click();

  const onFileChange = async (file: File | null) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const dataUrl = await fileToDataUrl(file);
    setForm((p) => ({ ...p, fotoProfil: dataUrl }));
  };

  const submit = async () => {
    if (!detail) return;

    setLocalError(null);
    if (!form.idRole) return setLocalError("Role wajib dipilih.");
    if (!form.idProdi) return setLocalError("Program Studi wajib dipilih.");

    try {
      await updateUser({
        id: detail._id,
        payload: {
          ...form,
          nama: form.nama?.trim(),
          angkatan: form.angkatan?.trim(),
          email: form.email?.trim(),
          alamat: form.alamat?.trim() ? form.alamat : undefined,
          fotoProfil: form.fotoProfil?.trim() ? form.fotoProfil : "",
        },
      });

      onSuccess?.();
      onClose();
    } catch {
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Data diambil dari endpoint detail: <b>/users/{`{id}`}</b>
          </p>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        {loadingUser || !detail ? (
          <div className="py-10 text-sm text-muted-foreground">
            Memuat data user...
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 mt-4">
              <img
                src={preview || baldAvatarSvg}
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

              <Button type="button" variant="outline" size="sm" onClick={pickFile}>
                Upload Profile Picture
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Field label="NIK / NRP">
                <Input value={detail.nrp} disabled />
              </Field>

              <Field label="Nama Lengkap">
                <Input
                  value={form.nama ?? ""}
                  onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))}
                />
              </Field>

              <Field label="Angkatan">
                <Input
                  value={form.angkatan ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, angkatan: e.target.value }))
                  }
                />
              </Field>

              <Field label="Program Studi">
                <Select
                  value={form.idProdi ?? ""}
                  onValueChange={(v) => setForm((p) => ({ ...p, idProdi: v }))}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder={loadingProdi ? "Memuat..." : "Pilih Program Studi"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(programStudi ?? []).map((p: any) => {
                      const id = String(p._id ?? p.id ?? "");
                      const label = String(p.namaProdi ?? p.namaProgramStudi ?? "-");
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
                  value={form.email ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </Field>

              <Field label="Alamat">
                <Input
                  value={form.alamat ?? ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, alamat: e.target.value }))
                  }
                />
              </Field>

              <Field label="Jenis Kelamin">
                <Select
                  value={(form.jenisKelamin ?? "pria") as JenisKelamin}
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
                  value={(form.status ?? "aktif") as UserStatusBE}
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
                  value={form.idRole ?? ""}
                  onValueChange={(v) => setForm((p) => ({ ...p, idRole: v }))}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder={loadingRoles ? "Memuat role..." : "Pilih Role"} />
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

            <div className="pt-8">
              <Button
                className="w-full md:w-1/3"
                type="button"
                onClick={submit}
                disabled={disabled}
              >
                {saving ? "Menyimpan..." : "Edit Data User"}
              </Button>
            </div>
          </>
        )}
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
