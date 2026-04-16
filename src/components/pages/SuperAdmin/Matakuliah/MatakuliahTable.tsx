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
  PaginationEllipsis,
} from "@/components/ui/pagination";

import MataKuliahActionDropdown from "../Matakuliah/MatakuliahActionDropdown";
import AddMatakuliahModal from "./Modal/AddMatakuliahModal";
import EditMatakuliahModal from "./Modal/EditMatakuliahModal";
import DeleteMatakuliahModal from "./Modal/DeleteMatakuliahModal";

import { useMatakuliah } from "./hooks/useMatakuliah";
import { useAcademicTermsOptions } from "./hooks/useAcademicTermsOptions";
import type { Matakuliah } from "./types/matakuliah";
import { toMatakuliahTableRow, type MatakuliahTableRow } from "./utils/mappers";
import { useNavigate } from "react-router-dom";

function MatakuliahTableSkeleton() {
  const rows = Array.from({ length: 10 });

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <Skeleton className="h-10 w-full sm:w-72 border border-black/20" />
          <Skeleton className="h-10 w-10 border-2 border-black shadow-[3px_3px_0_0_#000]" />
        </div>
        <Skeleton className="h-10 w-full sm:w-44 border-2 border-black shadow-[3px_3px_0_0_#000]" />
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto px-4 sm:px-0 max-w-[calc(100vw-2rem)] sm:max-w-full">
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
              {rows.map((_, i) => (
                <TableRow key={i} className="h-14 border-b border-black/5">
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
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

export default function MatakuliahTable() {
  const { matakuliah: entities, loading, error, refetch } = useMatakuliah();
  const { options: termOptions } = useAcademicTermsOptions();
  const navigate = useNavigate();

  const periodeToSemesterType = useMemo(() => {
    const map = new Map<string, string>();
    termOptions.forEach((t) => {
      if (t.label && t.semesterType) {
        map.set(t.label.trim(), t.semesterType);
      }
    });
    return map;
  }, [termOptions]);

  const rows: MatakuliahTableRow[] = useMemo(
    () =>
      entities
        .map((m: Matakuliah) => toMatakuliahTableRow(m))
        .sort((a, b) => b.id.localeCompare(a.id)), // newest first
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

  const isPeriodeAktif = useMemo(() => {
    if (!selectedEntity) return false;
    const term = termOptions.find(
      (t) => t.label.trim() === selectedEntity.namaPeriode?.trim()
    );
    return term?.status?.toLowerCase() === "aktif";
  }, [selectedEntity, termOptions]);

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
          <Button size="icon" className="border-2 border-black shadow-[3px_3px_0_0_#000]">
            <Icon icon="mdi:magnify" />
          </Button>
        </div>

        <Button
          onClick={() => setOpenAdd(true)}
          className="w-full sm:w-auto border-2 border-black shadow-[3px_3px_0_0_#000]"
        >
          <Icon icon="icon-park-solid:add" className="mr-2" />
          Add Matakuliah
        </Button>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto px-4 sm:px-0 max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[1100px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">Kode Matakuliah</TableHead>
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
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon icon="mdi:book-education-outline" className="text-7xl text-gray-200" />
                      <p className="mt-6 text-lg font-bold text-blue-900">Belum Ada Matakuliah</p>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Tambahkan matakuliah baru untuk mulai mengelola data perkuliahan.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((item) => {
                  const semesterType = periodeToSemesterType.get(item.namaPeriode.trim());
                  const periodeLabel = semesterType
                    ? `${item.namaPeriode} - ${semesterType}`
                    : item.namaPeriode;

                  return (
                    <TableRow
                      key={item.id}
                      className="h-14 border-b border-black/5 cursor-pointer hover:bg-black/5"
                      onClick={() => navigate(`/admin/courses/${item.id}`)}
                    >
                      <TableCell>{item.kodeMatkul}</TableCell>
                      <TableCell className="font-medium">{item.namaMatkul}</TableCell>
                      <TableCell>{item.sks}</TableCell>
                      <TableCell>{item.kelas}</TableCell>
                      <TableCell>{periodeLabel}</TableCell>
                      <TableCell>{item.namaPengajar}</TableCell>
                      <TableCell>
                        {item.status === "Aktif" ? (
                          <Badge variant="success">Aktif</Badge>
                        ) : (
                          <Badge variant="secondary">Tidak Aktif</Badge>
                        )}
                      </TableCell>
                      <TableCell
                        className="text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddMatakuliahModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => refetch()}
      />

      <EditMatakuliahModal
        key={selectedEntity?.id ?? "no-course"}
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected(null);
        }}
        data={selectedEntity}
        onSuccess={() => refetch()}
      />

      <DeleteMatakuliahModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelected(null);
        }}
        id={selectedEntity?.id ?? null}
        namaMatkul={selectedEntity?.namaMatkul}
        isPeriodeAktif={isPeriodeAktif}
        onSuccess={() => refetch()}
      />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-end">
          <Pagination>
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

       <p className="text-xs text-red-400 mt-4 text-center font-bold sm:text-left">
        * Klik baris matakuliah untuk melihat detail.
      </p>
    </div>
  );
}