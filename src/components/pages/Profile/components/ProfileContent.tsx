import AvatarUpload from "@/components/shared/AvatarUpload";
import PasswordInput from "@/components/shared/PasswordInput";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
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
import { useNavigate, useParams } from "react-router-dom";
import useEditProfile from "../hooks/useEditProfile";
import { useFetchProfile } from "../hooks/useFetchProfile";
import ProfileCard from "./ProfileCard";
import { cn } from "@/lib/cn";
import { getUser } from "@/lib/authStorage";
import { Checkbox } from "@/components/ui/checkbox";

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

const learningStyle = [
  {
    value: "visual",
    label: "Visual",
  },
  {
    value: "auditory",
    label: "Auditory",
  },
  {
    value: "reading/writing",
    label: "Reading/Writing",
  },
  {
    value: "kinesthetic",
    label: "Kinesthetic",
  },
];

const ProfileContent = ({ isEditing }: { isEditing: boolean }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isPending } = useFetchProfile(id);
  const { mutate, isPending: isSubmitting } = useEditProfile(
    data?.id as string,
  );

  const currentUser = getUser();
  const isUser = currentUser?.nrp === data?.nrp;

  console.log(data);
  console.log(id);

  const form = useForm<updateProfile>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      nama: data?.nama,
      alamat: data?.alamat,
      fotoProfil: data?.fotoProfil,
      passwordLama: "",
      passwordBaru: "",
      gayaBelajar: data?.gayaBelajar as (string | undefined)[] | undefined,
    },
    values: {
      nama: data?.nama as string,
      alamat: data?.alamat as string,
      fotoProfil: data?.fotoProfil as string,
      passwordLama: "",
      passwordBaru: "",
      gayaBelajar: data?.gayaBelajar as string[] | undefined,
    },
  });

  function onSubmit(formData: updateProfile) {
    mutate({
      payload: formData,
      gayaBelajarExists: !!data?.gayaBelajar?.length,
    });
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
          <ProfileCard className="lg:w-[220px] flex flex-col gap-3 h-fit justify-center items-center border-none">
            <ProfileCard
              className={cn(
                "p-0  overflow-hidden border border-primary border-none lg:w-fit",
              )}
            >
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
                  className="object-cover lg:h-30 lg:w-30 rounded-full"
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
            <div className="text-xs text-center">
              <p className="font-bold text-lg text-black">{data?.nrp}</p>
              <p className="text-sm">{data?.nama}</p>
              <p className="text-neutral-500">{data?.email}</p>
            </div>
            {!isEditing && isUser && (
              <Button
                type={"button"}
                onClick={() => navigate("/profile/edit")}
                variant={"default"}
                className="mx-auto shadow-sm"
                disabled={isPending || isSubmitting}
              >
                <span>Edit Profile</span>
                <Icon icon={"solar:arrow-right-up-linear"} />
              </Button>
            )}
          </ProfileCard>
          <ProfileCard className="grow flex flex-col gap-6">
            <FieldSet className="flex flex-col gap-4">
              <h1 className="font-semibold text-primary text-lg">
                Personal Information
              </h1>
              <div
                className={cn(
                  "grid lg:grid-cols-2 ",
                  isEditing ? "gap-9" : "gap-4",
                )}
              >
                <Field>
                  <FieldLabel className="text-gray-400">NRP</FieldLabel>
                  {isEditing ? (
                    <Input disabled value={data?.nrp} />
                  ) : (
                    <p className="">{data?.nrp}</p>
                  )}
                </Field>
                {
                  <Controller
                    name="nama"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          className="text-gray-400"
                          htmlFor={field.name}
                        >
                          Name
                        </FieldLabel>
                        {isEditing ? (
                          <Input
                            {...field}
                            id={field.name}
                            aria-invalid={fieldState.invalid}
                            placeholder="John Doe..."
                            disabled={!isEditing || isSubmitting}
                          />
                        ) : (
                          <p className="">{data?.nama}</p>
                        )}
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                }
                <Field>
                  <FieldLabel className="text-gray-400">Email</FieldLabel>
                  {isEditing ? (
                    <Input value={data?.email} type="email" disabled />
                  ) : (
                    <p className="">{data?.email}</p>
                  )}
                </Field>
                <Controller
                  name="alamat"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        className="text-gray-400"
                        htmlFor={field.name}
                      >
                        Address
                      </FieldLabel>
                      {isEditing ? (
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="Jl. Raya Maranatha..."
                          disabled={!isEditing || isSubmitting}
                        />
                      ) : (
                        <p className="">{data?.alamat}</p>
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
                <Field>
                  <FieldLabel className="text-gray-400">Class Of</FieldLabel>
                  {isEditing ? (
                    <Input value={data?.angkatan} disabled />
                  ) : (
                    <p className="">{data?.angkatan}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel className="text-gray-400">Major</FieldLabel>
                  {isEditing ? (
                    <Input value={data?.prodi} disabled />
                  ) : (
                    <p className="">{data?.prodi}</p>
                  )}
                </Field>
                <Field>
                  <FieldLabel className="text-gray-400">Gender</FieldLabel>
                  {isEditing ? (
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
                  ) : (
                    <p className="">
                      {data?.jenisKelamin
                        ? data?.jenisKelamin?.slice(0, 1).toUpperCase() +
                          data?.jenisKelamin?.slice(1)
                        : "-"}
                    </p>
                  )}
                </Field>
                <Field>
                  <FieldLabel className="text-gray-400">Status</FieldLabel>
                  {isEditing ? (
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
                  ) : (
                    <p className="">
                      {data?.status &&
                        data?.status.slice(0, 1).toUpperCase() +
                          data?.status.slice(1)}
                    </p>
                  )}
                </Field>
                {data?.namaRole !== "DOSEN" && (
                  <Controller
                    name="gayaBelajar"
                    control={form.control}
                    render={({ field }) => (
                      <Field>
                        <FieldLabel className="text-gray-400">
                          Learning Style
                        </FieldLabel>
                        <div className="flex items-center gap-4">
                          {isEditing &&
                            learningStyle.map((item) => (
                              <div
                                key={item.value}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  className="shadow-xs"
                                  id={item.value}
                                  disabled={!isEditing || isSubmitting}
                                  checked={
                                    field.value?.includes(item.value) ?? false
                                  }
                                  onCheckedChange={(checked) => {
                                    const current = field.value ?? [];
                                    if (checked) {
                                      field.onChange([...current, item.value]);
                                    } else {
                                      field.onChange(
                                        current.filter((v) => v !== item.value),
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={item.value}
                                  className="text-sm cursor-pointer"
                                >
                                  {item.label}
                                </label>
                              </div>
                            ))}

                          {!isEditing && (
                            <p>
                              {data?.gayaBelajar
                                ?.map(
                                  (item) =>
                                    item.slice(0, 1).toUpperCase() +
                                    item.slice(1),
                                )
                                .join(", ") ?? "-"}
                            </p>
                          )}
                        </div>
                      </Field>
                    )}
                  />
                )}
              </div>
            </FieldSet>
            {isEditing && (
              <FieldSet className="flex flex-col gap-4">
                <h1 className="font-semibold text-primary text-lg">
                  Change Password
                </h1>
                <div className="grid lg:grid-cols-2 gap-9">
                  <Controller
                    name="passwordLama"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                          Old Password
                        </FieldLabel>
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
                        <FieldLabel htmlFor={field.name}>
                          New Password
                        </FieldLabel>
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
              </FieldSet>
            )}
          </ProfileCard>
        </div>
        {isEditing && (
          <div className="lg:ml-auto flex items-center gap-4">
            <Button
              type={"button"}
              onClick={() => navigate("/profile")}
              variant={"outline"}
              className="shadow-sm"
              disabled={isPending || isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type={"submit"}
              onClick={form.handleSubmit(onSubmit)}
              variant={"default"}
              className="lg:ml-auto shadow-sm"
              disabled={isPending || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        )}
      </section>
    </form>
  );
};

export default ProfileContent;
