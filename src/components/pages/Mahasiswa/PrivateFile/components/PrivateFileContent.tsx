import { getPrivateFiles } from "@/api/private-file";
import AddButton from "@/components/shared/AddButton";
import Pagination from "@/components/shared/Pagination";
import Search from "@/components/shared/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/cn";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePreviewModal } from "./FilePreviewModal";
import useDeletePV from "../hooks/useDeletePv";
import { getFileName } from "../helpers";
import NoData from "@/components/shared/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const PrivateFileContent = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<{
    nama: string;
    path: string; // base64 data URL
    tipe: string;
    size: string;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isDeleted, setIsDeleted] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 1000);
  const { data, isPending } = useQuery({
    queryKey: ["private-file", page],
    queryFn: () => getPrivateFiles({ page }),
  });
  const { mutate: remove, isPending: isDeletePending } = useDeletePV();

  const files = debouncedSearch
    ? data?.data.filter(
        (pv) =>
          pv.id.includes(debouncedSearch) ||
          pv.status.toLowerCase().includes(debouncedSearch) ||
          getFileName(pv.id, pv.file.nama).includes(debouncedSearch) ||
          pv.file.tipe.includes(debouncedSearch),
      )
    : data?.data;
  const pagination = debouncedSearch
    ? {
        ...data?.pagination,
        page,
        total: files?.length,
      }
    : data?.pagination;

  const handleDelete = () => {
    remove(selectedId);
    setIsDeleted(false);
  };

  console.log({ data });
  return (
    <div className="flex flex-col gap-4  grow">
      <div className="flex items-center justify-between">
        <Search
          value={searchValue}
          onChange={(value) => setSearchValue(value)}
        />
        <AddButton
          label="Create Private File"
          className="shadow-2xl"
          onClick={() => navigate("/mahasiswa/private-file/create")}
        />
      </div>
      <main
        className={cn(
          "grow",
          (files?.length === 0 || isPending) &&
            "flex items-center justify-center",
        )}
      >
        {files?.length === 0 && (
          <NoData message="There is no Private Files Available" />
        )}
        {isPending && <Skeleton className="h-[500px] w-full" />}
        {files && files?.length > 0 && (
          <Table className="min-w-[900px] text-blue-800 overflow-x-auto">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">File</TableHead>
                <TableHead className="font-bold text-blue-900">Type</TableHead>
                <TableHead className="font-bold text-blue-900">
                  Status
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {files?.map((item) => (
                <TableRow
                  key={item.id}
                  className="h-14 border-b border-black/5"
                >
                  <TableCell className="font-medium flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-[#C5D1FF] justify-center items-center flex p-2 shadow">
                      <Icon icon="line-md:file-filled" fontSize={32} />
                    </div>
                    {getFileName(item.id, item.file.tipe)}
                  </TableCell>
                  <TableCell>{item.file.tipe}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell className="text-center flex items-center gap-2">
                    <Icon
                      icon="mdi:eye-outline"
                      fontSize={20}
                      className="cursor-pointer text-primary"
                      onClick={() =>
                        setPreview({
                          path: item.file.path,
                          tipe: item.file.tipe,
                          nama: getFileName(item.id, item.file.tipe),
                          size: item.file.size,
                        })
                      }
                    />
                    <Icon
                      onClick={() =>
                        navigate(`/mahasiswa/private-file/edit/${item.id}`)
                      }
                      icon="ic:baseline-edit"
                      fontSize={20}
                      className="cursor-pointer text-primary"
                    />
                    <Icon
                      icon={
                        isDeletePending && selectedId === item.id
                          ? "tdesign:loading"
                          : "fluent-mdl2:delete"
                      }
                      fontSize={20}
                      className={cn(
                        "cursor-pointer text-red-500",
                        isDeletePending &&
                          selectedId === item.id &&
                          "animate-spin",
                      )}
                      onClick={() => {
                        setSelectedId(item.id);
                        setIsDeleted(true);
                        // remove(item.id);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
      {preview && (
        <FilePreviewModal
          open={preview !== null}
          onOpenChange={() => setPreview(null)}
          file={preview}
        />
      )}
      {isDeleted && selectedId && (
        <DeleteConfirmationModal
          isOpen={isDeleted}
          onOpenChange={() => setIsDeleted(false)}
          onDelete={handleDelete}
        />
      )}
      {files && files?.length > 0 && (
        <Pagination
          page={pagination?.page as number}
          onPageChange={setPage}
          totalPages={pagination?.total_pages as number}
        />
      )}
    </div>
  );
};

export default PrivateFileContent;
