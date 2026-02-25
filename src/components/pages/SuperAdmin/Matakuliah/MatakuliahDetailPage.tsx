import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { MatakuliahService } from "./services/matakuliah.service";
import { useAddPengajarToMatkul } from "./hooks/useAddPengajarToMatkul";
import { useDeletePengajarFromMatkul } from "./hooks/useDeletePengajarFromMatkul";

import AddPengajarModal from "./Modal/AddPengajarModal";
import DeletePengajarModal from "./Modal/DeletePengajarModal";
import PengajarActionDropdown from "./PengajarActionDropdown";

type PengajarRow = {
  id: string;
  nrp: string;
  nama: string;
};

function PengajarTableSkeleton() {
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
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>NRP</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default function MatakuliahDetailPengajarPage() {
  const { id } = useParams();

  // ================= QUERY =================
  const query = useQuery({
    queryKey: ["course", id],
    queryFn: () => MatakuliahService.getMatakuliahById(id!),
    enabled: !!id,
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const detail: any = query.data ?? null;

  const pengajar: PengajarRow[] = useMemo(() => {
    const p = detail?.pengajar;
    if (!Array.isArray(p)) return [];

    return p
      .map((x: any) => ({
        id: String(x?.id ?? x?._id ?? "").trim(),
        nrp: String(x?.nrp ?? x?.nim ?? x?.nip ?? "").trim(),
        nama: String(x?.nama ?? x?.name ?? "").trim(),
      }))
      .filter((x) => x.id);
  }, [detail]);

  // ================= HOOKS =================
  const addPengajarMutation = useAddPengajarToMatkul(id);
  const deletePengajarMutation = useDeletePengajarFromMatkul(id);

  // ================= SEARCH & PAGINATION =================
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return pengajar;

    return pengajar.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) ||
        r.nrp.toLowerCase().includes(q),
    );
  }, [pengajar, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // ================= MODAL STATE =================
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<PengajarRow | null>(null);

  const errorMessage = query.error
    ? (query.error as any)?.response?.data?.message ??
      (query.error as any)?.message ??
      "Gagal mengambil detail matakuliah"
    : null;

  if (query.isLoading) return <PengajarTableSkeleton />;

  if (errorMessage) {
    return (
      <div className="bg-white w-full p-6">
        <div className="mb-4 mt-4 text-red-600">{errorMessage}</div>
        <div className="flex gap-2">
          <Button
            onClick={() => query.refetch()}
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          >
            Coba lagi
          </Button>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="border-2 border-black shadow-[3px_3px_0_0_#000]"
          >
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full">
      {/* SEARCH + ADD */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search pengajar..."
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
            onClick={() => setPage(1)}
            type="button"
          >
            <Icon icon="mdi:magnify" />
          </Button>
        </div>

        <Button
          onClick={() => setOpenAdd(true)}
          className="border-2 border-black shadow-[3px_3px_0_0_#000]"
        >
          <Icon icon="icon-park-solid:add" className="mr-2" />
          Tambah Pengajar
        </Button>
      </div>

      {/* TABLE */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-primary">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 font-bold text-blue-900">No</TableHead>
                <TableHead className="font-bold text-blue-900">NRP</TableHead>
                <TableHead className="font-bold text-blue-900">Nama</TableHead>
                <TableHead className="text-right pr-4 font-bold text-blue-900">Aksi</TableHead>
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
                paginated.map((p, idx) => {
                  const no = (page - 1) * limit + idx + 1;
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="text-center w-16">{no}</TableCell>
                      <TableCell>{p.nrp || "-"}</TableCell>
                      <TableCell>{p.nama || "-"}</TableCell>
                      <TableCell className="text-right pr-4">
                        <PengajarActionDropdown
                          onDelete={() => {
                            setSelected(p);
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-end">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setPage((p) => Math.max(p - 1, 1))
                  }
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
                    setPage((p) =>
                      Math.min(p + 1, totalPages),
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* ADD MODAL */}
      <AddPengajarModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={async (payload) => {
          await addPengajarMutation.mutateAsync([payload.id]);
          setPage(1);
        }}
      />

      {/* DELETE MODAL */}
      <DeletePengajarModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelected(null);
        }}
        data={selected}
        onConfirm={async (id) => {
          await deletePengajarMutation.mutateAsync(id);
          setPage(1);
        }}
      />
    </div>
  );
}