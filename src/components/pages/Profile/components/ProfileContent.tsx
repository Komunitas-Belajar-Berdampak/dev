import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { updateProfileSchema, type updateProfile } from "@/schemas/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { Controller, useForm } from "react-hook-form";
import { useFetchProfile } from "../hooks/useFetchProfile";
import ProfileCard from "./ProfileCard";
import { useNavigate } from "react-router-dom";
import PasswordInput from "@/components/shared/PasswordInput";
import useEditProfile from "../hooks/useEditProfile";
import AvatarUpload from "@/components/shared/AvatarUpload";

const genders = [
  {
    value: "pria",
    label: "Pria",
  },
  {
    value: "wanita",
    label: "Wanita",
  },
];

const status = [
  {
    value: "aktif",
    label: "Aktif",
  },
  {
    value: "tidak aktif",
    label: "Tidak Aktif",
  },
];

const ProfileContent = ({ isEditing }: { isEditing: boolean }) => {
  const navigate = useNavigate();
  const { data, isPending } = useFetchProfile();
  const { mutate, isPending: isSubmitting } = useEditProfile();

  console.log(data);

  const form = useForm<updateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nama: data?.nama,
      alamat: data?.alamat,
      fotoProfil: data?.fotoProfil,
      passwordLama: "",
      passwordBaru: "",
    },
    values: {
      nama: data?.nama as string,
      alamat: data?.alamat as string,
      fotoProfil: data?.fotoProfil as string,
      passwordLama: "",
      passwordBaru: "",
    },
  });

  function onSubmit(data: updateProfile) {
    mutate(data);
  }

  if (isPending) {
    return (
      <div className="flex gap-6">
        <Skeleton className="h-64 w-1/4" />
        <Skeleton className="h-64 grow" />
      </div>
    );
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <section className="flex flex-col gap-7.5">
        <div className="flex flex-col lg:flex-row gap-6">
          <ProfileCard className="lg:w-[220px] flex flex-col gap-3 h-fit">
            <ProfileCard className="p-0 rounded-xl overflow-hidden border border-primary lg:w-fit">
              {isEditing ? (
                <Controller
                  name="fotoProfil"
                  control={form.control}
                  render={({ field }) => (
                    <AvatarUpload
                      className="p-4.5"
                      currentImage={data?.fotoProfil}
                      disabled={!isEditing || isSubmitting}
                      onChange={(file) => field.onChange(file)}
                    />
                  )}
                />
              ) : data?.fotoProfil ? (
                <img
                  src={data?.fotoProfil}
                  alt="avatar"
                  className="object-cover lg:h-30 lg:w-30"
                />
              ) : (
                <Icon
                  icon="boxicons:user-filled"
                  className="p-4.5 text-primary"
                  width="120"
                  height="120"
                />
              )}
            </ProfileCard>
            <div className="text-xs text-neutral-500">
              <p className="font-bold text-lg text-black">{data?.nrp}</p>
              <p>{data?.nama}</p>
              <p>{data?.email}</p>
            </div>
          </ProfileCard>
          <ProfileCard className="grow flex flex-col gap-6">
            <h1 className="font-semibold text-primary text-lg">
              Personal Information
            </h1>
            <div className="grid lg:grid-cols-2 gap-9">
              <Field>
                <FieldLabel>NRP</FieldLabel>
                <Input disabled value={data?.nrp} />
              </Field>
              <Controller
                name="nama"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe..."
                      disabled={!isEditing || isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input value={data?.email} type="email" disabled />
              </Field>

              <Controller
                name="alamat"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Jl. Raya Maranatha..."
                      disabled={!isEditing || isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Field>
                <FieldLabel>Class Of</FieldLabel>
                <Input value={data?.angkatan} disabled />
              </Field>

              <Field>
                <FieldLabel>Major</FieldLabel>
                <Input value={data?.prodi} disabled />
              </Field>

              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Select disabled value={data?.jenisKelamin}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender..." />
                  </SelectTrigger>
                  <SelectContent>
                    {genders?.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select value={data?.status} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="update status..." />
                  </SelectTrigger>
                  <SelectContent>
                    {status?.map((stat) => (
                      <SelectItem key={stat.value} value={stat.value}>
                        {stat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Controller
                name="passwordLama"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Old Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Input your old password here..."
                      disabled={!isEditing || isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="passwordBaru"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
                    <PasswordInput
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder="Input your old password here..."
                      disabled={!isEditing || isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </ProfileCard>
        </div>
        <Button
          type={isEditing ? "submit" : "button"}
          onClick={
            isEditing
              ? form.handleSubmit(onSubmit)
              : () => navigate("/profile/edit")
          }
          variant={"default"}
          className="lg:ml-auto shadow-sm"
          disabled={isPending || isSubmitting}
        >
          {isEditing
            ? isSubmitting
              ? "Menyimpan..."
              : "Simpan"
            : "Edit Profil"}
        </Button>
      </section>
    </form>
  );
};

export default ProfileContent;
