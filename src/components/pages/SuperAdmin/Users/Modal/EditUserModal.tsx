import { useEffect, useMemo, useState } from "react";
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
import { useUpdateUser } from "../hooks/useUpdateUser";
import { useRoles } from "../hooks/useRoles";
import type { JenisKelamin, UserEntity, UserStatusBE } from "../types/user";

type UpdateUserPayload = {
  idRole?: string;
  nama?: string;
  angkatan?: string;
  email?: string;
  alamat?: string;
  jenisKelamin?: JenisKelamin;
  status?: UserStatusBE;
};

type EditUserForm = {
  idRole: string;
  nama: string;
  angkatan: string;
  email: string;
  alamat: string;
  jenisKelamin: JenisKelamin;
  status: UserStatusBE;
};

function norm(v: unknown) {
  return String(v ?? "").toLowerCase().trim();
}

export default function EditUserModal({
  open,
  onClose,
  onSuccess,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: string | null;
}) {
  const { updateUser, loading: saving, error: updateError } = useUpdateUser();
  const { roles, loading: loadingRoles } = useRoles();

  const [detail, setDetail] = useState<UserEntity | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [form, setForm] = useState<EditUserForm>({
    idRole: "",
    nama: "",
    angkatan: "",
    email: "",
    alamat: "",
    jenisKelamin: "pria",
    status: "aktif",
  });

  // ✅ fetch detail by id
  useEffect(() => {
    if (!open || !userId) return;

    setLoadingUser(true);
    setFetchError(null);
    setDetail(null);

    UsersService.getUserById(userId)
      .then((u: UserEntity) => {
        setDetail(u);
        setForm({
          idRole: "", // resolve later
          nama: u.nama ?? "",
          angkatan: u.angkatan ?? "",
          email: u.email ?? "",
          alamat: u.alamat ?? "",
          jenisKelamin: (u.jenisKelamin ?? "pria") as JenisKelamin,
          status: (u.status ?? "aktif") as UserStatusBE,
        });
      })
      .catch((e: any) => {
        setFetchError(
          e?.response?.data?.message ?? e?.message ?? "Gagal memuat data user",
        );
      })
      .finally(() => setLoadingUser(false));
  }, [open, userId]);

  // ✅ map role string -> idRole
  useEffect(() => {
    if (!open || !detail) return;
    if (!roles?.length) return;

    const roleName = norm((detail as any).role);
    const roleId = roles.find((r: any) => norm(r.nama) === roleName)?.id ?? "";
    setForm((p) => ({ ...p, idRole: roleId }));
  }, [open, detail?._id, roles]);

  const disabled = useMemo(() => {
    if (!detail) return true;
    if (loadingUser || saving) return true;
    return (
      !form.nama.trim() ||
      !form.angkatan.trim() ||
      !form.email.trim() ||
      !form.jenisKelamin ||
      !form.status ||
      !form.idRole
    );
  }, [detail, loadingUser, saving, form]);

  const submit = async () => {
    if (!detail) return;

    const payload: UpdateUserPayload = {
      idRole: form.idRole,
      nama: form.nama.trim(),
      angkatan: form.angkatan.trim(),
      email: form.email.trim(),
      alamat: form.alamat.trim() ? form.alamat.trim() : undefined,
      jenisKelamin: form.jenisKelamin,
      status: form.status,
    };

    await updateUser({ id: detail._id, payload });
    onSuccess?.();
    onClose();
  };

  const combinedError = fetchError ?? updateError ?? null;

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
            Silahkan ubah data User!
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Field label="NIK / NRP">
                <Input value={detail.nrp} disabled />
              </Field>

              <Field label="Nama Lengkap">
                <Input
                  value={form.nama}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, nama: e.target.value }))
                  }
                />
              </Field>

              <Field label="Angkatan">
                <Input
                  value={form.angkatan}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, angkatan: e.target.value }))
                  }
                />
              </Field>

              <Field label="Program Studi">
                <Input value={(detail as any).prodi ?? "-"} disabled />
              </Field>

              <Field label="Email">
                <Input
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </Field>

              <Field label="Alamat">
                <Input
                  value={form.alamat}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, alamat: e.target.value }))
                  }
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
                    <SelectValue placeholder="Pilih jenis kelamin" />
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
                    <SelectValue placeholder="Pilih status" />
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
                  onValueChange={(v) => setForm((p) => ({ ...p, idRole: v }))}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue
                      placeholder={loadingRoles ? "Memuat role..." : "Pilih role"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r: any) => (
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
                onClick={submit}
                disabled={disabled}
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
