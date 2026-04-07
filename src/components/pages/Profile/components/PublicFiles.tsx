import { useQuery } from "@tanstack/react-query";
import ProfileCard from "./ProfileCard";
import { getPrivateFiles } from "@/api/private-file";
import { Icon } from "@iconify/react";
import { Skeleton } from "@/components/ui/skeleton";
import { FilePreviewModal } from "../../Mahasiswa/PrivateFile/components/FilePreviewModal";
import { useState } from "react";
import { cn } from "@/lib/utils";
const isImages = ["jpg", "jpeg", "png", "gif", "bmp", "webp"];
const PublicFiles = () => {
  const { data, isPending } = useQuery({
    queryKey: ["publicFiles"],
    queryFn: () => getPrivateFiles({}),
  });
  const [preview, setPreview] = useState<{
    nama: string;
    path: string;
    tipe: string;
    size: string;
  } | null>(null);
  const publicFiles = data?.data.filter(
    (file) => file.status.toLowerCase() === "visible",
  );
  console.log("data nih", data);
  const amountFile = publicFiles?.length || 0;
  return (
    <ProfileCard className="">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary">Public Files</h1>
        <p className="text-sm bg-primary text-white px-2 py-1 rounded-md">
          {amountFile} {amountFile > 1 ? "file" : "files"}
        </p>
      </div>
      {isPending && <Skeleton className="w-full h-40 mt-4" />}
      {!isPending && (
        <section className="min-h-40 grid gap-4 grid-cols-1 md:grid-cols-2 mt-4">
          {publicFiles && publicFiles?.length > 0 ? (
            publicFiles.map((data) => (
              <div
                className="flex items-center gap-4 p-4 grow rounded-lg border border-neutral-300 cursor-pointer hover:bg-neutral-100 transition-colors duration-300"
                onClick={() =>
                  setPreview({
                    path: data.file.path,
                    tipe: data.file.tipe,
                    nama: data.file.nama,
                    size: data.file.size,
                  })
                }
              >
                <div
                  className={cn(
                    "p-4 rounded-lg",
                    isImages.includes(
                      data.file.tipe.split("/")[1]?.toLowerCase(),
                    )
                      ? "bg-blue-200 text-blue-800"
                      : "bg-red-200 text-red-800",
                  )}
                >
                  <Icon
                    icon={
                      isImages.includes(
                        data.file.tipe.split("/")[1]?.toLowerCase(),
                      )
                        ? "boxicons:image"
                        : "mdi:file-outline"
                    }
                    className="text-4xl"
                  />
                </div>
                <div className="">
                  <p>{data.file.nama}</p>
                  <p>
                    {data.file.tipe} • {data.file.size}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="italic text-muted-foreground text-center">
              No public files shared yet.
            </p>
          )}
        </section>
      )}
      {preview && (
        <FilePreviewModal
          open={preview !== null}
          onOpenChange={() => setPreview(null)}
          file={preview}
        />
      )}
    </ProfileCard>
  );
};

export default PublicFiles;
