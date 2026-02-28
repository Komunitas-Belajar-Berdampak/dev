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
    <div className="">
      <Title title="Private File" items={breadcrumbsItems} />
      <PrivateFileContent />
    </div>
  );
};

export default PrivateFilePage;
