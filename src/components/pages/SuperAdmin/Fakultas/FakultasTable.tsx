import { useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import type { Fakultas } from "./types/fakultas";
import FakultasActionDropdown from "../Fakultas/FakultasActionDropdown";
import AddFakultasModal from "../Fakultas/Modal/AddFakultasModal";
import EditFakultasModal from "../Fakultas/Modal/EditFakultasModal";
import DeleteFakultasModal from "../Fakultas/Modal/DeleteFakultasModal";

/**
 * Dummy data
 */
const FAKULTAS: Fakultas[] = [
  {
    id: 1,
    kodeFakultas: "007",
    namaFakultas: "Fakultas Teknologi dan Rekayasa Cerdas",
    programStudi: [
      "Teknik Sipil",
      "Sistem Komputer",
      "Teknik Industri",
      "Teknik Elektro",
      "Teknik Informatika",
      "Sistem Informasi",
    ],
  },
  {
    id: 2,
    kodeFakultas: "002",
    namaFakultas: "Fakultas Hukum dan Bisnis Digital",
    programStudi: ["Akuntansi", "Manajemen", "Hukum"],
  },
];

export default function FakultasTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const filtered = FAKULTAS.filter(
    (f) =>
      f.namaFakultas.toLowerCase().includes(search.toLowerCase()) ||
      f.kodeFakultas.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / limit);

  const paginated = filtered.slice(
    (page - 1) * limit,
    page * limit
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedFakultas, setSelectedFakultas] = useState<Fakultas | null>(null);

  return (
    <div className="bg-white w-full">
      {/* TOP ACTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        {/* SEARCH */}
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

          <Button
            size="icon"
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          >
            <Icon icon="mdi:magnify" className="text-lg" />
          </Button>
        </div>

        {/* ADD */}
        <Button
          onClick={() => setOpenAdd(true)}
          className="
            w-full sm:w-auto
            border-2 border-black
            shadow-[3px_3px_0_0_#000]
            font-semibold
          "
        >
          <Icon icon="mdi:plus" className="mr-2 text-lg" />
          Add Fakultas
        </Button>
      </div>

      {/* TABLE */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">
                  Kode Fakultas
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Nama Fakultas
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Program Studi
                </TableHead>
                <TableHead className="font-bold text-blue-900 text-center">
                  Aksi
                </TableHead>
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
                  <TableRow
                    key={item.id}
                    className="h-14 border-b border-black/5"
                  >
                    <TableCell>{item.kodeFakultas}</TableCell>

                    <TableCell className="font-medium">
                      {item.namaFakultas}
                    </TableCell>

                    <TableCell>
                      <ul className="list-disc list-inside space-y-1">
                        {item.programStudi.map((prodi) => (
                          <li key={prodi}>{prodi}</li>
                        ))}
                      </ul>
                    </TableCell>

                    <TableCell className="text-center">
                      <FakultasActionDropdown
                        onEdit={() => {
                        setSelectedFakultas(item);
                        setOpenEdit(true);
                      }}
                        onDelete={() => {
                          setSelectedFakultas(item);
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

      <AddFakultasModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditFakultasModal open={openEdit}
        onClose={() => setOpenEdit(false)}
        fakultas={
          selectedFakultas
            ? null // Replace USER_ENTITIES with the correct data source or remove this logic
            : null
        } />
      <DeleteFakultasModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={() => setOpenDelete(false)}
      />


      {/* PAGINATION */}
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
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
