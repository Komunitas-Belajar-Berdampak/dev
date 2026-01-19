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
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import MataKuliahActionDropdown from "../Matakuliah/MatakuliahActionDropdown";
import type { Matakuliah } from "./types/matakuliah";

import AddMatakuliahModal from "./Modal/AddMatakuliahModal";
import EditMatakuliahModal from "./Modal/EditMatakuliahModal";
import DeleteMatakuliahModal from "./Modal/DeleteMatakuliahModal";

/**
 * Dummy data
 */
const DATA: Matakuliah[] = [
  {
    id: "1",
    kodeMatkul: "IN243",
    namaMatkul: "Analitik Kebijakan",
    sks: 4,
    kelas: "A",
    status: "aktif",
    idPeriode: "p1",
    namaPeriode: "2025/2026 - Ganjil - Semester 7",
    idPengajar: "d1",
    namaPengajar: "Dr. Andi Wijaya",
    idMahasiswa: ["m1", "m2"],
    deskripsi: "Mata kuliah analisis kebijakan publik",
  },
];

export default function MatakuliahTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const filtered = DATA.filter(
    (m) =>
      m.namaMatkul.toLowerCase().includes(search.toLowerCase()) ||
      m.kodeMatkul.includes(search)
  );

  const totalPages = Math.ceil(filtered.length / limit);
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<Matakuliah | null>(null);

  return (
    <div className="bg-white w-full">
      {/* TOP ACTION */}
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

      {/* TABLE */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[1100px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">
                  Kode
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Nama Matakuliah
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  SKS
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Kelas
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Periode
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Pengajar
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Status
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
                  className="h-14 border-b border-black/5"
                >
                  <TableCell>{item.kodeMatkul}</TableCell>
                  <TableCell className="font-medium">
                    {item.namaMatkul}
                  </TableCell>
                  <TableCell>{item.sks}</TableCell>
                  <TableCell>{item.kelas}</TableCell>
                  <TableCell>{item.namaPeriode}</TableCell>
                  <TableCell>{item.namaPengajar}</TableCell>
                  <TableCell>
                    {item.status === "aktif" ? (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODALS */}
      <AddMatakuliahModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />
      <EditMatakuliahModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        data={selected}
      />
      <DeleteMatakuliahModal
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
