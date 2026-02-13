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

import { useUserById } from "../hooks/useUserById";
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useRoles } from "../hooks/useRoles";
import { useProgramStudi } from "../../ProgramStudi/hooks/useProgramStudi";

type JenisKelamin = "pria" | "wanita";
type UserStatusBE = "aktif" | "tidak aktif";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string | null; // ✅ id
  onSuccess?: () => void;
};

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const norm = (v: unknown) => String(v ?? "").toLowerCase().trim();

function pickId(v: any): string {
  if (!v) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  return String(v.id ?? v._id ?? "");
}

function pickName(v: any): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return String(v.nama ?? v.name ?? v.role ?? "");
}

export default function EditUserModal({ open, onClose, userId, onSuccess }: Props) {
  const { updateUser, loading: saving, error: updateError } = useUpdateUser();

  const rolesQ = useRoles();
  const prodiQ = useProgramStudi();

  const userQ = useUserById(userId, open);
  const user = userQ.data as any;

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [localError, setLocalError] = useState<string | null>(null);

  const [form, setForm] = useState({
    nrp: "",
    idRole: "",
    idProdi: "",
    nama: "",
    angkatan: "",
    email: "",
    alamat: "",
    jenisKelamin: "pria" as JenisKelamin,
    status: "aktif" as UserStatusBE,
    fotoProfil: "",
  });

  // 1) Isi form dari user detail (ambil idRole/idProdi dengan robust)
  useEffect(() => {
    if (!open) return;
    setLocalError(null);
    if (!user) return;

    const resolvedRoleId =
      pickId(user.idRole) ||
      pickId(user.roleId) ||
      pickId(user.role?.idRole) ||
      pickId(user.role); // kalau user.role ternyata id

    const resolvedProdiId =
      pickId(user.idProdi) ||
      pickId(user.prodiId) ||
      pickId(user.prodi?.idProdi) ||
      pickId(user.prodi); // kalau user.prodi ternyata id

    setPreview(user.fotoProfil ?? "");
    setForm({
      nrp: user.nrp ?? "",
      idRole: resolvedRoleId,
      idProdi: resolvedProdiId,
      nama: user.nama ?? "",
      angkatan: user.angkatan ?? "",
      email: user.email ?? "",
      alamat: user.alamat ?? "",
      jenisKelamin: (user.jenisKelamin ?? "pria") as JenisKelamin,
      status: (user.status ?? "aktif") as UserStatusBE,
      fotoProfil: user.fotoProfil ?? "",
    });
  }, [open, user?.id]);

  // 2) Kalau idRole masih kosong, resolve pakai NAMA role -> cari di roles list
  useEffect(() => {
    if (!open || !user) return;
    if (form.idRole) return;

    const roles = (rolesQ.roles ?? []) as any[];
    if (!roles.length) return;

    // ambil nama role dari berbagai kemungkinan
    const roleName =
      norm(pickName(user.role)) ||
      norm(pickName(user.idRole)) || // kalau idRole object punya nama
      norm(pickName(user.roleName)) ||
      norm(pickName(user.namaRole));

    if (!roleName) return;

    const match = roles.find((r) => norm(pickName(r)) === roleName);
    const id = match ? pickId(match) : "";
    if (id) setForm((p) => ({ ...p, idRole: id }));
  }, [open, user?.id, rolesQ.roles, form.idRole]);

  // 3) Prodi juga robust (kalau idProdi kosong -> resolve dari nama)
  useEffect(() => {
    if (!open || !user) return;
    if (form.idProdi) return;

    const list = (prodiQ.programStudi ?? []) as any[];
    if (!list.length) return;

    const prodiName =
      norm(pickName(user.prodi)) ||
      norm(pickName(user.idProdi)) ||
      norm(pickName(user.prodiName)) ||
      norm(pickName(user.namaProdi));

    if (!prodiName) return;

    const match = list.find((p) => norm(pickName(p.namaProdi ?? p.namaProgramStudi ?? p.nama)) === prodiName);
    const id = match ? pickId(match) : "";
    if (id) setForm((p) => ({ ...p, idProdi: id }));
  }, [open, user?.id, prodiQ.programStudi, form.idProdi]);

  const disabled = useMemo(() => {
    if (!userId) return true;
    if (saving || userQ.isLoading) return true;

    return (
      !form.nrp.trim() ||
      !form.nama.trim() ||
      !form.angkatan.trim() ||
      !form.email.trim() ||
      !form.idRole ||
      !form.idProdi
    );
  }, [userId, saving, userQ.isLoading, form]);

  const pickFile = () => fileRef.current?.click();

  const onFileChange = async (file: File | null) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    const base64 = await fileToDataUrl(file);
    setForm((p) => ({ ...p, fotoProfil: base64 }));
  };

  const submit = async () => {
    if (!userId) return;

    setLocalError(null);
    if (!form.idRole) return setLocalError("Role wajib dipilih.");
    if (!form.idProdi) return setLocalError("Program Studi wajib dipilih.");

    const payload: any = {
      nrp: form.nrp,
      idRole: form.idRole,
      idProdi: form.idProdi,
      nama: form.nama,
      angkatan: form.angkatan,
      email: form.email,
      alamat: form.alamat,
      jenisKelamin: form.jenisKelamin,
      status: form.status,
      fotoProfil: form.fotoProfil,
    };

    try {
      await updateUser({ id: userId, payload });
      onSuccess?.();
      onClose();
    } catch {}
  };

  const combinedError =
    localError ??
    updateError ??
    rolesQ.error ??
    prodiQ.error ??
    (userQ.error
      ? (userQ.error as any)?.response?.data?.message ??
        (userQ.error as any)?.message ??
        "Failed to load user detail"
      : null);

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Silahkan ubah data User!
          </p>
        </DialogHeader>

        {combinedError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {combinedError}
          </div>
        ) : null}

        {userQ.isLoading ? (
          <div className="py-10 text-sm text-muted-foreground">Memuat data user...</div>
        ) : !user ? (
          <div className="py-10 text-sm text-muted-foreground">User tidak ditemukan.</div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3 mt-2">
              <img
                src={preview || "https://i.pravatar.cc/120"}
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
                Upload Foto Profil
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <Field label="NRP">
                <Input value={form.nrp} onChange={(e) => setForm((p) => ({ ...p, nrp: e.target.value }))} />
              </Field>

              <Field label="Nama">
                <Input value={form.nama} onChange={(e) => setForm((p) => ({ ...p, nama: e.target.value }))} />
              </Field>

              <Field label="Angkatan">
                <Input value={form.angkatan} onChange={(e) => setForm((p) => ({ ...p, angkatan: e.target.value }))} />
              </Field>

              <Field label="Email">
                <Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              </Field>

              <Field label="Alamat">
                <Input value={form.alamat} onChange={(e) => setForm((p) => ({ ...p, alamat: e.target.value }))} />
              </Field>

              <Field label="Program Studi">
                <Select value={form.idProdi} onValueChange={(v) => setForm((p) => ({ ...p, idProdi: v }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder={prodiQ.loading ? "Memuat prodi..." : "Pilih Program Studi"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(prodiQ.programStudi ?? []).map((p: any) => {
                      const id = pickId(p);
                      const label = String(p.namaProdi ?? p.namaProgramStudi ?? p.nama ?? "-");
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

              <Field label="Role">
                <Select value={form.idRole} onValueChange={(v) => setForm((p) => ({ ...p, idRole: v }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder={rolesQ.loading ? "Memuat role..." : "Pilih Role"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(rolesQ.roles ?? []).map((r: any) => {
                      const id = pickId(r);
                      const label = String(r.nama ?? r.name ?? "-");
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

              <Field label="Jenis Kelamin">
                <Select
                  value={form.jenisKelamin}
                  onValueChange={(v) => setForm((p) => ({ ...p, jenisKelamin: v as JenisKelamin }))}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pria">Pria</SelectItem>
                    <SelectItem value="wanita">Wanita</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Status">
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as UserStatusBE }))}>
                  <SelectTrigger className="w-full h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="tidak aktif">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Batal</Button>
              <Button onClick={submit} disabled={disabled}>
                {saving ? "Menyimpan..." : "Simpan"}
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
      <div className="text-sm font-medium">{label}</div>
      {children}
    </div>
  );
}
