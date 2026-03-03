import FileDropzone from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  createPrivateFileSchema,
  type CreatePrivateFileType,
} from "@/schemas/private-file";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import useCreatePV from "../hooks/useCreatePV";

const CreatePVForm = () => {
  const { mutate, isPending } = useCreatePV();
  const form = useForm<CreatePrivateFileType>({
    resolver: zodResolver(createPrivateFileSchema),
    defaultValues: {
      filePath: "",
      fileSize: "",
      status: "PRIVATE",
      tipe: "",
    },
  });

  const onSubmit = (values: CreatePrivateFileType) => {
    console.log(values);
    mutate(values);
  };
  return (
    <form
      id="create-pv-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className=""
    >
      <section className="flex flex-col gap-6">
        <Controller
          control={form.control}
          name="filePath"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel
                htmlFor={field.name}
                className="text-xl text-primary font-semibold"
              >
                File <span className="text-red-600">*</span>
              </FieldLabel>
              <FileDropzone
                disabled={isPending}
                accept={{
                  "application/pdf": [".pdf"],
                  "image/*": [".png", ".jpg", ".jpeg"],
                }}
                onFileSelect={({ filePath, fileSize, tipe }) => {
                  form.setValue("filePath", filePath, { shouldValidate: true });
                  form.setValue("fileSize", fileSize);
                  form.setValue("tipe", tipe);
                }}
                onFileRemove={() => {
                  form.setValue("filePath", "", { shouldValidate: true });
                  form.setValue("fileSize", "");
                  form.setValue("tipe", "");
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="">
              <FieldLabel
                htmlFor={field.name}
                className="text-xl text-primary font-semibold"
              >
                Status <span className="text-red-600">*</span>
              </FieldLabel>
              <div className="flex items-center gap-3">
                <Switch
                  id={field.name}
                  disabled={isPending}
                  aria-invalid={fieldState.invalid}
                  checked={field.value === "VISIBLE"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "VISIBLE" : "PRIVATE")
                  }
                  className="shadow-none"
                />
                <p>{field.value === "VISIBLE" ? "Visible" : "Private"}</p>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" disabled={isPending}>
          Upload
        </Button>
      </section>
    </form>
  );
};

export default CreatePVForm;
