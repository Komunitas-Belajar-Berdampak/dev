import FileDropzone from "@/components/shared/FileDropzone";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import {
  editPrivateFileSchema,
  type EditPrivateFileType,
} from "@/schemas/private-file";
import type { PrivateFile } from "@/types/private-file";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import useEditPV from "../hooks/useEditPV";

const EditPVForm = ({ data }: { data: PrivateFile }) => {
  const { mutate, isPending } = useEditPV();
  const params = useParams();
  const form = useForm<EditPrivateFileType>({
    resolver: zodResolver(editPrivateFileSchema),
    defaultValues: {
      status: data?.status as "VISIBLE" | "PRIVATE",
    },
    values: {
      status: data?.status as "VISIBLE" | "PRIVATE",
    },
  });

  const onSubmit = (values: EditPrivateFileType) => {
    mutate({ id: params.id as string, payload: values });
  };
  return (
    <form
      id="create-pv-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className=""
    >
      <section className="flex flex-col gap-6">
        <Field>
          <FieldLabel className="text-xl text-primary font-semibold">
            File <span className="text-red-600">*</span>
          </FieldLabel>
          <FileDropzone
            initialFile={{
              name: data.file.nama,
              size: data.file.size,
              tipe: data.file.tipe,
              path: data.file.path,
            }}
            disabled
            accept={{
              "application/pdf": [".pdf"],
              "image/*": [".png", ".jpg", ".jpeg"],
            }}
          />
        </Field>
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

export default EditPVForm;
