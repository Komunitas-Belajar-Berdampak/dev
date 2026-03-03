import Title from "@/components/shared/Title";
import CreatePVForm from "./CreatePVForm";

const breadcrumbsItems = [
  {
    label: "Private File",
    href: "/mahasiswa/private-file",
  },
  {
    label: "Create Private File",
    href: "/mahasiswa/private-file/create",
  },
];

const CreatePrivateFilePage = () => {
  return (
    <div className="flex flex-col gap-6">
      <Title title="Create Private File" items={breadcrumbsItems} />
      <CreatePVForm />
    </div>
  );
};

export default CreatePrivateFilePage;
