import Title from "@/components/shared/Title";
import PrivateFileContent from "./PrivateFileContent";

const breadcrumbsItems = [
  {
    label: "Private File",
    href: "/mahasiswa/private-file",
  },
];

const PrivateFilePage = () => {
  return (
    <section className="flex flex-col gap-6 h-full">
      <Title title="Private File" items={breadcrumbsItems} />
      <PrivateFileContent />
    </section>
  );
};

export default PrivateFilePage;
