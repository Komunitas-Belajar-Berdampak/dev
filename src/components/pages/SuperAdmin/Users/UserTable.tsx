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

import { useUsers } from "./hooks/useUsers";
import type { UserEntity, UserTableRow } from "./types/user";

function mapUserToTable(user: UserEntity): UserTableRow {
  return {
    id: user._id,
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
                <TableHead className="font-bold text-blue-900">
                  Program Studi
                </TableHead>
                <TableHead className="font-bold text-blue-900">Status</TableHead>
                <TableHead className="font-bold text-blue-900">Role</TableHead>
                <TableHead className="font-bold text-blue-900 text-center">
                  Aksi
                </TableHead>
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

      <div className="mt-10 flex justify-center sm:justify-end">
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export default function UserTable() {
  const { users: userEntities, loading, error, refetch } = useUsers();

  const USERS: UserTableRow[] = useMemo(
    () => (userEntities ?? []).map(mapUserToTable),
    [userEntities],
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const filteredUsers = USERS.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.nrp.includes(search),
  );

  const totalPages = Math.ceil(filteredUsers.length / limit);
  const paginatedUsers = filteredUsers.slice((page - 1) * limit, page * limit);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

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
                <TableHead className="font-bold text-blue-900 text-center">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    Data tidak ditemukan
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
                        <Badge variant="danger">Non Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{row.role}</TableCell>
                    <TableCell className="text-center">
                      <UserActionDropdown
                        onEdit={() => {
                          setSelectedUserId(row.id);
                          setOpenEdit(true);
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
        onSuccess={() => refetch()}
      />

      {/* ✅ modal edit fetch by id */}
      <EditUserModal
        open={openEdit}
        userId={selectedUserId}
        onClose={() => {
          setOpenEdit(false);
          setSelectedUserId(null);
        }}
        onSuccess={() => refetch()}
      />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center sm:justify-end">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
