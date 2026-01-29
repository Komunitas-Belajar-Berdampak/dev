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
} from "@/components/ui/pagination";

import ProgramStudiActionDropdown from "../ProgramStudi/ProgramStudiActionDropdown";
import AddProgramStudiModal from "./Modal/AddProgramStudiModal";
import EditProgramStudiModal from "./Modal/EditProgramStudiModal";
import DeleteProgramStudiModal from "./Modal/DeleteProgramStudiModal";

import { useProgramStudi } from "./hooks/useProgramStudi";
import type { ProgramStudiEntity, ProgramStudiTableRow } from "./types/program-studi";
import { toProgramStudiTableRow } from "./utils/mappers";

function ProgramStudiTableSkeleton() {
  const rows = Array.from({ length: 10 });

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <Skeleton className="h-10 w-full sm:w-64 border border-black/20" />
          <Skeleton className="h-10 w-10 border-2 border-black shadow-[3px_3px_0_0_#000]" />
        </div>
        <Skeleton className="h-10 w-full sm:w-52 border-2 border-black shadow-[3px_3px_0_0_#000]" />
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[850px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">Kode Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900">Nama Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900">Fakultas</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((_, i) => (
                <TableRow key={i} className="border-b border-black/5 h-14">
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>

                  <TableCell className="font-medium">
                    <Skeleton className="h-4 w-60" />
                  </TableCell>

                  <TableCell>
                    <Skeleton className="h-4 w-44" />
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


export default function ProgramStudiTable() {
  const { programStudi: programStudiEntities, loading, error, refetch } = useProgramStudi();

  const rows: ProgramStudiTableRow[] = useMemo(
    () => programStudiEntities.map(toProgramStudiTableRow),
    [programStudiEntities],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = rows.filter(
    (p) =>
      p.namaProdi.toLowerCase().includes(search.toLowerCase()) ||
      p.kodeProdi.includes(search),
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<ProgramStudiTableRow | null>(null);

  const selectedEntity: ProgramStudiEntity | null =
    selected
      ? programStudiEntities.find((p) => p.id === selected.id) ?? null
      : null;

  if (loading) return <ProgramStudiTableSkeleton />;

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
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-64 border border-black/20 text-blue-800"
          />
          <Button size="icon" className="border-2 border-black shadow-[3px_3px_0_0_#000]">
            <Icon icon="mdi:magnify" />
          </Button>
        </div>

        <Button
          onClick={() => setOpenAdd(true)}
          className="w-full sm:w-auto border-2 border-black shadow-[3px_3px_0_0_#000]"
        >
          <Icon icon="mdi:plus" className="mr-2" />
          Add Program Studi
        </Button>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[850px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">Kode Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900">Nama Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900">Fakultas</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    Data tidak ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => (
                  <TableRow key={item.id} className="border-b border-black/5 h-14">
                    <TableCell>{item.kodeProdi}</TableCell>
                    <TableCell className="font-medium">{item.namaProdi}</TableCell>
                    <TableCell>{item.namaFakultas}</TableCell>
                    <TableCell className="text-center">
                      <ProgramStudiActionDropdown
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

      <AddProgramStudiModal open={openAdd} onClose={() => setOpenAdd(false)} />

      <EditProgramStudiModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selectedEntity}
      />

      <DeleteProgramStudiModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
      />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => setPage((p) => Math.max(p - 1, 1))} />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext onClick={() => setPage((p) => Math.min(p + 1, totalPages))} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
