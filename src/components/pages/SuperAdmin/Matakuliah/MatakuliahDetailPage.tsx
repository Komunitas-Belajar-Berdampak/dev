import { useEffect, useMemo, useState } from "react";
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
import AddPengajarModal, { type PengajarEntity } from "./Modal/AddPengajarModal";
import EditPengajarModal from "./Modal/EditPengajarModal";
import DeletePengajarModal from "./Modal/DeletePengajarModal";
import PengajarActionDropdown from "./PengajarActionDropdown";

type PengajarRow = {
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
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900 w-[90px]">No</TableHead>
                <TableHead className="font-bold text-blue-900">NRP</TableHead>
                <TableHead className="font-bold text-blue-900">Nama</TableHead>
                <TableHead className="font-bold text-blue-900 w-[120px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((_, i) => (
                <TableRow key={i} className="h-14 border-b border-black/5">
                  <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell className="font-medium"><Skeleton className="h-4 w-56" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
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

export default function MatakuliahDetailPengajarPage() {
  const { id } = useParams();

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
  const fetchedRows: PengajarRow[] = useMemo(() => {
    const p = detail?.pengajar;

    if (Array.isArray(p)) {
      return p
        .map((x: any) => ({
          nrp: String(x?.nrp ?? x?.nim ?? x?.nip ?? "").trim(),
          nama: String(x?.nama ?? x?.name ?? "").trim(),
        }))
        .filter((x) => x.nrp || x.nama);
    }

    if (typeof p === "string") {
      const nama = p.trim();
      return nama ? [{ nrp: "-", nama }] : [];
    }

    return [];
  }, [detail]);

  const [pengajar, setPengajar] = useState<PengajarEntity[]>([]);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    // seed sekali saat data pertama kali ada
    if (seeded) return;
    if (!query.isSuccess) return;

    const seededData: PengajarEntity[] = fetchedRows.map((r, idx) => ({
      id: `seed-${idx}-${String(r.nrp)}-${String(r.nama)}`,
      nrp: r.nrp || "-",
      nama: r.nama || "-",
    }));

    setPengajar(seededData);
    setSeeded(true);
  }, [seeded, query.isSuccess, fetchedRows]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return pengajar;

    return pengajar.filter(
      (r) =>
        r.nama.toLowerCase().includes(q) || r.nrp.toLowerCase().includes(q),
    );
  }, [pengajar, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<PengajarEntity | null>(null);

  const openEditFor = (row: PengajarEntity) => {
    setSelected(row);
    setOpenEdit(true);
  };

  const openDeleteFor = (row: PengajarEntity) => {
    setSelected(row);
    setOpenDelete(true);
  };

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
          <Icon icon="mdi:plus" className="mr-2" />
          Tambah Pengajar
        </Button>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900 w-[90px]">No</TableHead>
                <TableHead className="font-bold text-blue-900">NRP</TableHead>
                <TableHead className="font-bold text-blue-900">Nama</TableHead>
                <TableHead className="font-bold text-blue-900 w-[120px]">Aksi</TableHead>
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
                    <TableRow key={p.id} className="h-14 border-b border-black/5">
                      <TableCell className="font-mono">{no}</TableCell>
                      <TableCell className="font-mono">{p.nrp || "-"}</TableCell>
                      <TableCell className="font-medium">{p.nama || "-"}</TableCell>
                      <TableCell>
                        <PengajarActionDropdown
                          onEdit={() => openEditFor(p)}
                          onDelete={() => openDeleteFor(p)}
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

      {/* =========================
          ✅ Modals (Dummy)
          ========================= */}
      <AddPengajarModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSubmit={(payload) => {
          setPengajar((prev) => [
            {
              id: `tmp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              ...payload,
            },
            ...prev,
          ]);
          setPage(1);
        }}
      />

      <EditPengajarModal
        open={openEdit}
        onClose={() => {
          setOpenEdit(false);
          setSelected(null);
        }}
        data={selected}
        onSubmit={(updated) => {
          setPengajar((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        }}
      />

      <DeletePengajarModal
        open={openDelete}
        onClose={() => {
          setOpenDelete(false);
          setSelected(null);
        }}
        data={selected}
        onConfirm={(id) => {
          setPengajar((prev) => prev.filter((x) => x.id !== id));
          setPage(1);
        }}
      />
    </div>
  );
}