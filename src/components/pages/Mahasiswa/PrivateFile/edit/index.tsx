import Title from "@/components/shared/Title";
import { useParams } from "react-router-dom";
import EditPVForm from "./EditPVForm";
import { getPrivateFiles } from "@/api/private-file";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { PrivateFile } from "@/types/private-file";

const EditPrivateFilePage = () => {
  const params = useParams();
  const { data, isPending } = useQuery({
    queryKey: ["private-file"],
    queryFn: () => getPrivateFiles({}),
  });
  const breadcrumbsItems = [
    {
      label: "Private File",
      href: "/mahasiswa/private-file",
    },
    {
      label: "Edit Private File",
      href: `/mahasiswa/private-file/edit/${params.id}`,
    },
  ];
  const privateFile = data?.data.find((pv) => pv.id === params.id);
  console.log(privateFile);
  return (
    <div className="flex flex-col gap-6">
      <Title
        title={`Edit Private File #${params.id}`}
        items={breadcrumbsItems}
      />
      {isPending ? (
        <Skeleton className="h-[344px] w-full" />
      ) : (
        <EditPVForm data={privateFile as PrivateFile} />
      )}
    </div>
  );
};

export default EditPrivateFilePage;
