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

import UserActionDropdown from "./UserActionDropdown";
import AddUserModal from "./Modal/AddUserModal";
import EditUserModal from "./Modal/EditUserModal";
import ResetPasswordModal from "./Modal/ResetPasswordDefault";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "@/components/ui/pagination";
import { useUsers } from "./hooks/useUsers";
import type { UserEntity, UserTableRow } from "./types/user";

function mapUserToTable(user: UserEntity): UserTableRow {
  return {
    id: (user as any).id ?? (user as any)._id,
    nrp: user.nrp,
    nama: user.nama,
    angkatan: user.angkatan ?? "-",
    prodi: user.prodi ?? "-",
    status: user.status === "aktif" ? "Aktif" : "Non Aktif",
    role: user.role ?? "-",
  };
}

function UsersTableSkeleton() {
  const rows = Array.from({ length: 10 });

  return (
    <div className="bg-white w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div className="flex w-full sm:w-auto gap-2">
          <div className="w-full sm:w-64">
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-10 border-2 border-black shadow-[3px_3px_0_0_#000]" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 border-2 border-black shadow-[3px_3px_0_0_#000]" />
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">NRP</TableHead>
                <TableHead className="font-bold text-blue-900">Nama</TableHead>
                <TableHead className="font-bold text-blue-900">Angkatan</TableHead>
                <TableHead className="font-bold text-blue-900">Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900">Status</TableHead>
                <TableHead className="font-bold text-blue-900">Role</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rows.map((_, i) => (
                <TableRow key={i} className="h-14 border-b border-black/5">
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-8 w-8 inline-block rounded-md" />
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

export default function UserTable() {
  const { users: userEntities, loading, error, refetch } = useUsers();

  const USERS: UserTableRow[] = useMemo(
    () =>
      (userEntities ?? [])
        .map(mapUserToTable)
        .sort((a, b) => b.id.localeCompare(a.id)),
    [userEntities],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return USERS.filter(
      (u) =>
        u.nama.toLowerCase().includes(q) ||
        u.nrp.includes(search),
    );
  }, [USERS, search]);

  const totalPages = Math.ceil(filteredUsers.length / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
  const [selectedUserNrp, setSelectedUserNrp] = useState<string | null>(null);

  if (loading) return <UsersTableSkeleton />;

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
          <Icon icon="icon-park-solid:add" className="mr-2" />
          Add User
        </Button>
      </div>

      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">NRP</TableHead>
                <TableHead className="font-bold text-blue-900">Nama</TableHead>
                <TableHead className="font-bold text-blue-900">Angkatan</TableHead>
                <TableHead className="font-bold text-blue-900">Program Studi</TableHead>
                <TableHead className="font-bold text-blue-900">Status</TableHead>
                <TableHead className="font-bold text-blue-900">Role</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Icon icon="mdi:account-group-outline" className="text-7xl text-gray-200" />
                      <p className="mt-6 text-lg font-bold text-blue-900">Belum Ada User</p>
                      <p className="mt-2 text-sm text-gray-500 max-w-sm">
                        Tambahkan user baru untuk mulai mengelola data pengguna sistem.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((row) => (
                  <TableRow key={row.id} className="h-14 border-b border-black/5">
                    <TableCell>{row.nrp}</TableCell>
                    <TableCell className="font-medium">{row.nama}</TableCell>
                    <TableCell>{row.angkatan}</TableCell>
                    <TableCell>{row.prodi}</TableCell>
                    <TableCell>
                      {row.status === "Aktif" ? (
                        <Badge variant="success">Aktif</Badge>
                      ) : (
                        <Badge variant="danger">Tidak Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell className="text-center">
                      <UserActionDropdown
                        onEdit={() => {
                          setSelectedUserId(row.id);
                          setOpenEdit(true);
                        }}
                        onEditPassword={() => {
                          setSelectedUserId(row.id);
                          setSelectedUserName(row.nama);
                          setSelectedUserNrp(row.nrp);
                          setOpenResetPassword(true);
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

      <AddUserModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          refetch();
          setPage(1);
          setOpenAdd(false);
        }}
      />

      <EditUserModal
        open={openEdit}
        userId={selectedUserId}
        onClose={() => {
          setOpenEdit(false);
          setSelectedUserId(null);
        }}
        onSuccess={() => {
          refetch();
          setOpenEdit(false);
          setSelectedUserId(null);
        }}
      />

      <ResetPasswordModal
        open={openResetPassword}
        userId={selectedUserId}
        userName={selectedUserName}
        userNrp={selectedUserNrp}
        onClose={() => {
          setOpenResetPassword(false);
          setSelectedUserId(null);
          setSelectedUserName(null);
          setSelectedUserNrp(null);
        }}
        onSuccess={() => {
          refetch();
          setOpenResetPassword(false);
          setSelectedUserId(null);
          setSelectedUserName(null);
          setSelectedUserNrp(null);
        }}
      />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-center">
          <Pagination className="justify-center">
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