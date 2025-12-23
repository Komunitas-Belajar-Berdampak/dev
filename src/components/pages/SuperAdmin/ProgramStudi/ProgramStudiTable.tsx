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

import type { ProgramStudi } from "./types/program-studi";
import ProgramStudiActionDropdown from "../ProgramStudi/ProgramStudiActionDropdown";

import AddProgramStudiModal from "./Modal/AddProgramStudiModal";
import EditProgramStudiModal from "./Modal/EditProgramStudiModal";
import DeleteProgramStudiModal from "./Modal/DeleteProgramStudiModal";

/**
 * Dummy data
 */
const PROGRAM_STUDI: ProgramStudi[] = [
  {
    id: "1",
    kodeProgramStudi: "72",
    namaProgramStudi: "Teknik Informatika",
    idFakultas: "f1",
    namaFakultas: "Fakultas Teknologi dan Rekayasa Cerdas",
  },
  {
    id: "2",
    kodeProgramStudi: "73",
    namaProgramStudi: "Sistem Informasi",
    idFakultas: "f1",
    namaFakultas: "Fakultas Teknologi dan Rekayasa Cerdas",
  },
];

export default function ProgramStudiTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const filtered = PROGRAM_STUDI.filter(
    (p) =>
      p.namaProgramStudi.toLowerCase().includes(search.toLowerCase()) ||
      p.kodeProgramStudi.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<ProgramStudi | null>(null);

  return (
    <div className="bg-white w-full">
      {/* TOP ACTION */}
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
          Add Program Studi
        </Button>
      </div>

      {/* TABLE */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[850px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">
                  Kode Program Studi
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Nama Program Studi
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Fakultas
                </TableHead>
                <TableHead className="font-bold text-blue-900 text-center">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((item) => (
                <TableRow
                  key={item.id}
                  className="border-b border-black/5 h-14"
                >
                  <TableCell>{item.kodeProgramStudi}</TableCell>
                  <TableCell className="font-medium">
                    {item.namaProgramStudi}
                  </TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODALS */}
      <AddProgramStudiModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />

      <EditProgramStudiModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selected}
      />

      <DeleteProgramStudiModal
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
