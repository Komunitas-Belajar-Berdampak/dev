import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useAddMahasiswaToMatkul } from "./hooks/useAddMahasiswaToMatkul";
import { useDeleteMahasiswaFromMatkul } from "./hooks/useDeleteMahasiswaFromMatkul";

import AddPengajarModal from "./Modal/AddPengajarModal";
import DeletePengajarModal from "./Modal/DeletePengajarModal";
import PengajarActionDropdown from "./PengajarActionDropdown";

import AddMahasiswaModal from "./Modal/AddMahasiswaModal";
import DeleteMahasiswaModal from "./Modal/DeleteMahasiswaModal";
import MahasiswaActionDropdown from "./MahasiswaActionDropdown";

// ── Toast helpers ─────────────────────────────────────────────────────────────

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };

function toastMinimalError(type: "pengajar" | "mahasiswa") {
  toast.error(`Tidak Dapat Menghapus ${type === "pengajar" ? "Pengajar" : "Mahasiswa"}!`, {
    description: `Minimal harus ada 1 ${type === "pengajar" ? "pengajar" : "mahasiswa"} dalam matakuliah.`,
    icon: errorIcon,
    style: errorStyle,
    descriptionClassName: "!text-white/90",
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

type PengajarRow = {
  id: string;
  nrp: string;
  nama: string;
};

type MahasiswaRow = {
  id: string;
  nim: string;
  nama: string;
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

function TableSkeleton({ columns }: { columns: string[] }) {
  const rows = Array.from({ length: 10 });

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full sm:w-auto gap-2">
          <Skeleton className="h-10 w-full sm:w-72 border border-black/20" />
          <Skeleton className="h-10 w-10 border-2 border-black shadow-[3px_3px_0_0_#000]" />
        </div>
        <Skeleton className="h-10 w-full sm:w-44 border-2 border-black shadow-[3px_3px_0_0_#000]" />
      </div>

      <div className="relative -mx-4 sm:mx-0 mt-8">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                {columns.map((c) => <TableHead key={c}>{c}</TableHead>)}
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

// ── Pengajar Tab ──────────────────────────────────────────────────────────────

function PengajarTab({
  pengajar,
  courseId,
  tabsNode,
}: {
  pengajar: PengajarRow[];
  courseId: string;
  tabsNode: ReactNode;
}) {
  const addMutation = useAddPengajarToMatkul(courseId);
  const deleteMutation = useDeletePengajarFromMatkul(courseId);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<PengajarRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return pengajar;
    return pengajar.filter(
      (r) => r.nama.toLowerCase().includes(q) || r.nrp.toLowerCase().includes(q),
    );
  }, [pengajar, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <>
      {/* Search + Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search pengajar..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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

      {/* Tabs line */}
      {tabsNode}

      {/* Table */}
      <div className="relative -mx-4 sm:mx-0 mt-4">
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
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon icon="mdi:account-tie-outline" className="text-7xl text-gray-200" />
                      <p className="mt-6 text-lg font-bold text-blue-900">Belum Ada Pengajar</p>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Tambahkan pengajar untuk matakuliah ini.
                      </p>
                    </div>
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
                            if (pengajar.length <= 1) {
                              toastMinimalError("pengajar");
                              return;
                            }
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

      <AddPengajarModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        existingIds={pengajar.map((p) => p.id)}
        onSubmit={async (payload) => {
          await addMutation.mutateAsync([payload.id]);
          setPage(1);
        }}
      />

      <DeletePengajarModal
        open={openDelete}
        onClose={() => { setOpenDelete(false); setSelected(null); }}
        data={selected}
        onConfirm={async (id) => {
          await deleteMutation.mutateAsync(id);
          setPage(1);
        }}
      />
    </>
  );
}

// ── Mahasiswa Tab ─────────────────────────────────────────────────────────────

function MahasiswaTab({
  mahasiswa,
  courseId,
  tabsNode,
}: {
  mahasiswa: MahasiswaRow[];
  courseId: string;
  tabsNode: ReactNode;
}) {
  const addMutation = useAddMahasiswaToMatkul(courseId);
  const deleteMutation = useDeleteMahasiswaFromMatkul(courseId);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<MahasiswaRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return mahasiswa;
    return mahasiswa.filter(
      (r) => r.nama.toLowerCase().includes(q) || r.nim.toLowerCase().includes(q),
    );
  }, [mahasiswa, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  return (
    <>
      {/* Search + Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full sm:w-auto gap-2">
          <Input
            placeholder="Search mahasiswa..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
          Tambah Mahasiswa
        </Button>
      </div>

      {/* Tabs line */}
      {tabsNode}

      {/* Table */}
      <div className="relative -mx-4 sm:mx-0 mt-4">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-primary">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 font-bold text-blue-900">No</TableHead>
                <TableHead className="font-bold text-blue-900">NIM</TableHead>
                <TableHead className="font-bold text-blue-900">Nama</TableHead>
                <TableHead className="text-right pr-4 font-bold text-blue-900">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon icon="mdi:account-school-outline" className="text-7xl text-gray-200" />
                      <p className="mt-6 text-lg font-bold text-blue-900">Belum Ada Mahasiswa</p>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Tambahkan mahasiswa untuk matakuliah ini.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((m, idx) => {
                  const no = (page - 1) * limit + idx + 1;
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="text-center w-16">{no}</TableCell>
                      <TableCell>{m.nim || "-"}</TableCell>
                      <TableCell>{m.nama || "-"}</TableCell>
                      <TableCell className="text-right pr-4">
                        <MahasiswaActionDropdown
                          onDelete={() => {
                            if (mahasiswa.length <= 1) {
                              toastMinimalError("mahasiswa");
                              return;
                            }
                            setSelected(m);
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

      <AddMahasiswaModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        existingIds={mahasiswa.map((m) => m.id)}
        onSubmit={async (payload) => {
          await addMutation.mutateAsync([payload.id]);
          setPage(1);
        }}
      />

      <DeleteMahasiswaModal
        open={openDelete}
        onClose={() => { setOpenDelete(false); setSelected(null); }}
        data={selected}
        onConfirm={async (id) => {
          await deleteMutation.mutateAsync(id);
          setPage(1);
        }}
      />
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function MatakuliahDetailPage() {
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

  const mahasiswa: MahasiswaRow[] = useMemo(() => {
    const m = detail?.mahasiswa;
    if (!Array.isArray(m)) return [];
    return m
      .map((x: any) => ({
        id: String(x?.id ?? x?._id ?? "").trim(),
        nim: String(x?.nim ?? x?.nrp ?? x?.nip ?? "").trim(),
        nama: String(x?.nama ?? x?.name ?? "").trim(),
      }))
      .filter((x) => x.id);
  }, [detail]);

  const errorMessage = query.error
    ? (query.error as any)?.response?.data?.message ??
      (query.error as any)?.message ??
      "Gagal mengambil detail matakuliah"
    : null;

  if (query.isLoading) {
    return <TableSkeleton columns={["No", "NIM/NRP", "Nama", "Aksi"]} />;
  }

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

  const tabsList = (
    <TabsList variant="line" className="mt-4">
      <TabsTrigger value="pengajar">
        <Icon icon="mdi:account-tie" className="mr-2" />
        Pengajar
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-black/10">
          {pengajar.length}
        </span>
      </TabsTrigger>
      <TabsTrigger value="mahasiswa">
        <Icon icon="mdi:account-school" className="mr-2" />
        Mahasiswa
        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-black/10">
          {mahasiswa.length}
        </span>
      </TabsTrigger>
    </TabsList>
  );

  return (
    <div className="bg-white w-full">
      <Tabs defaultValue="pengajar" className="w-full">
        <TabsContent value="pengajar">
          <PengajarTab pengajar={pengajar} courseId={id!} tabsNode={tabsList} />
        </TabsContent>

        <TabsContent value="mahasiswa">
          <MahasiswaTab mahasiswa={mahasiswa} courseId={id!} tabsNode={tabsList} />
        </TabsContent>
      </Tabs>
    </div>
  );
}