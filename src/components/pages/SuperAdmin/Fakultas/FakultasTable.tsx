import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

import FakultasActionDropdown from "./FakultasActionDropdown";
import AddFakultasModal from "./Modal/AddFakultasModal";
import EditFakultasModal from "./Modal/EditFakultasModal";

import { useFakultas } from "./hooks/useFakultas";
import type { FakultasEntity, FakultasTableRow } from "./types/fakultas";
import { toFakultasTableRow } from "./utils/mappers";

function FakultasTableSkeleton() {
  const rows = Array.from({ length: 10 });

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <Skeleton className="h-10 w-full sm:w-64 border border-black/20" />
          <Skeleton className="h-10 w-10 border-2 border-black shadow-[3px_3px_0_0_#000]" />
        </div>
        <Skeleton className="h-10 w-full sm:w-40 border-2 border-black shadow-[3px_3px_0_0_#000]" />
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">Kode Fakultas</TableHead>
                <TableHead className="font-bold text-blue-900">Nama Fakultas</TableHead>
                <TableHead className="font-bold text-blue-900">Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((_, i) => (
                <TableRow key={i} className="h-14 border-b border-black/5">
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-60" /></TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-52" />
                      <Skeleton className="h-4 w-44" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Skeleton className="h-9 w-9 rounded-md" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default function FakultasTable() {
  const { fakultas: fakultasEntitiesRaw, loading, error, refetch } = useFakultas();
  const fakultasEntities: FakultasEntity[] = fakultasEntitiesRaw ?? [];

  const rows: FakultasTableRow[] = useMemo(
    () =>
      fakultasEntities
        .map(toFakultasTableRow)
        .sort((a, b) => b.id.localeCompare(a.id)),
    [fakultasEntities],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(
      (f) =>
        f.namaFakultas.toLowerCase().includes(q) ||
        f.kodeFakultas.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<FakultasTableRow | null>(null);

  const selectedEntity: FakultasEntity | null = useMemo(() => {
    if (!selected) return null;
    return fakultasEntities.find((f: any) => (f._id ?? f.id) === selected.id) ?? null;
  }, [selected, fakultasEntities]);

  if (loading) return <FakultasTableSkeleton />;

  if (error) {
    return (
      <div className="bg-white w-full p-6">
        <div className="mb-4 text-red-600">{error}</div>
        <Button onClick={() => refetch()} className="border-2 border-black shadow-[3px_3px_0_0_#000]">
          Coba lagi
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full sm:w-64 border border-black/20 text-blue-800"
          />
          <Button size="icon" className="border-2 border-black shadow-[3px_3px_0_0_#000]">
            <Icon icon="mdi:magnify" className="text-lg" />
          </Button>
        </div>

        <Button
          onClick={() => setOpenAdd(true)}
          className="w-full sm:w-auto border-2 border-black shadow-[3px_3px_0_0_#000] font-semibold"
        >
          <Icon icon="icon-park-solid:add" className="mr-2 text-lg" />
          Add Fakultas
        </Button>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">Kode Fakultas</TableHead>
                <TableHead className="font-bold text-blue-900">Nama Fakultas</TableHead>
                <TableHead className="font-bold text-blue-900">Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon icon="mdi:office-building-outline" className="text-7xl text-gray-200" />
                      <p className="mt-6 text-lg font-bold text-blue-900">Belum Ada Fakultas</p>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Tambahkan fakultas baru untuk mulai mengelola data akademik.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item.id} className="h-14 border-b border-black/5">
                    <TableCell>{item.kodeFakultas}</TableCell>
                    <TableCell className="font-medium">{item.namaFakultas}</TableCell>
                    <TableCell>
                      {item.programStudi.length ? (
                        <ul className="list-disc list-inside space-y-1">
                          {item.programStudi.map((prodi) => (
                            <li key={prodi}>{prodi}</li>
                          ))}
                        </ul>
                      ) : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <FakultasActionDropdown
                        onEdit={() => { setSelected(item); setOpenEdit(true); }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddFakultasModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          refetch();
          setPage(1);
          setOpenAdd(false);
        }}
      />

      <EditFakultasModal
        key={selectedEntity?.id ?? selected?.id ?? "no-fakultas"}
        open={openEdit}
        onClose={() => { setOpenEdit(false); setSelected(null); }}
        fakultas={selectedEntity}
        onSuccess={() => {
          refetch();
          setOpenEdit(false);
          setSelected(null);
        }}
      />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-end">
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                  if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("ellipsis");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={page === p}
                        onClick={() => setPage(p)}
                        className="cursor-pointer"
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}