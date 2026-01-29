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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import MataKuliahActionDropdown from "../Matakuliah/MatakuliahActionDropdown";
import AddMatakuliahModal from "./Modal/AddMatakuliahModal";
import EditMatakuliahModal from "./Modal/EditMatakuliahModal";
import DeleteMatakuliahModal from "./Modal/DeleteMatakuliahModal";

import { useMatakuliah } from "./hooks/useMatakuliah";
import type { Matakuliah } from "./types/matakuliah";
import { toMatakuliahTableRow, type MatakuliahTableRow } from "./utils/mappers";

function MatakuliahTableSkeleton() {
  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <Skeleton className="h-10 w-full sm:w-72" />
          <Skeleton className="h-10 w-10" />
        </div>
        <Skeleton className="h-10 w-full sm:w-44" />
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <div className="min-w-[1100px]">
            <div className="grid grid-cols-8 gap-3 border-b border-black/10 pb-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full" />
              ))}
            </div>

            <div className="mt-4 space-y-3">
              {Array.from({ length: 10 }).map((_, row) => (
                <div key={row} className="grid grid-cols-8 gap-3 items-center">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-28" />
                  <div className="justify-self-center">
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center sm:justify-end">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatakuliahTable() {
  const { matakuliah: entities, loading, error, refetch } = useMatakuliah();

  const rows: MatakuliahTableRow[] = useMemo(
    () => entities.map((m: Matakuliah) => toMatakuliahTableRow(m)),
    [entities],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = rows.filter(
    (m) =>
      m.namaMatkul.toLowerCase().includes(search.toLowerCase()) ||
      m.kodeMatkul.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<MatakuliahTableRow | null>(null);

  const selectedEntity: Matakuliah | null =
    selected ? entities.find((m) => m.id === selected.id) ?? null : null;

  if (loading) return <MatakuliahTableSkeleton />;

  if (error) {
    return (
      <div className="bg-white w-full p-6">
        <div className="mb-4 text-red-600">{error}</div>
        <Button
          onClick={() => refetch()}
          className="border-2 border-black shadow-[3px_3px_0_0_#000]"
        >
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
            placeholder="Search matakuliah..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-72 border border-black/20 text-blue-800"
          />
          <Button
            size="icon"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          >
            <Icon icon="mdi:magnify" />
          </Button>
        </div>

        <Button
          onClick={() => setOpenAdd(true)}
          className="w-full sm:w-auto border-2 border-black shadow-[3px_3px_0_0_#000]"
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Add Matakuliah
        </Button>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[1100px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">Kode</TableHead>
                <TableHead className="font-bold text-blue-900">Nama Matakuliah</TableHead>
                <TableHead className="font-bold text-blue-900">SKS</TableHead>
                <TableHead className="font-bold text-blue-900">Kelas</TableHead>
                <TableHead className="font-bold text-blue-900">Periode</TableHead>
                <TableHead className="font-bold text-blue-900">Pengajar</TableHead>
                <TableHead className="font-bold text-blue-900">Status</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item.id} className="h-14 border-b border-black/5">
                    <TableCell>{item.kodeMatkul}</TableCell>
                    <TableCell className="font-medium">{item.namaMatkul}</TableCell>
                    <TableCell>{item.sks}</TableCell>
                    <TableCell>{item.kelas}</TableCell>
                    <TableCell>{item.namaPeriode}</TableCell>
                    <TableCell>{item.namaPengajar}</TableCell>
                    <TableCell>
                      {item.status === "Aktif" ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : (
                        <Badge variant="secondary">Tidak Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <MataKuliahActionDropdown
                        onEdit={() => {
                          setSelected(item);
                          setOpenEdit(true);
                        }}
                        onDelete={() => {
                          setSelected(item);
                          setOpenDelete(true);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddMatakuliahModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditMatakuliahModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selectedEntity}
      />
      <DeleteMatakuliahModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
      />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
