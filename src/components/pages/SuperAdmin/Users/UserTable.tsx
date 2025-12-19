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

import UserActionDropdown from "./UserActionDropdown";

import AddUserModal from "./Modal/AddUserModal";
import EditUserModal from "./Modal/EditUserModal";
import DeleteUserModal from "./Modal/DeleteUserModal";

import type { UserEntity, UserTableRow } from "./types/user";

// === DUMMY BACKEND DATA ===
const USER_ENTITIES: UserEntity[] = Array.from({ length: 42 }, (_, i) => ({
  _id: String(i + 1),
  nrp: `22304${i.toString().padStart(3, "0")}`,
  nama: `User ${i + 1}`,
  angkatan: i % 2 === 0 ? "2023" : undefined,
  idProdi: "prodi-ti",
  email: `user${i}@kampus.ac.id`,
  alamat: "Jl. Sumantri No 42",
  jenisKelamin: i % 2 === 0 ? "pria" : "wanita",
  status: i % 3 === 0 ? "tidak aktif" : "aktif",
  roleId: i % 2 === 0 ? ["role-mahasiswa"] : ["role-dosen"],
}));

// === MAPPER (BACKEND → TABLE) ===
function mapUserToTable(user: UserEntity): UserTableRow {
  return {
    id: user._id,
    nrp: user.nrp,
    nama: user.nama,
    angkatan: user.angkatan ?? "-",
    prodi: "Teknik Informatika", // nanti mapping idProdi → nama
    status: user.status === "aktif" ? "Aktif" : "Non Aktif",
    role: user.roleId.includes("role-dosen") ? "Dosen" : "Mahasiswa",
  };
}

const USERS: UserTableRow[] = USER_ENTITIES.map(mapUserToTable);


export default function UserTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  const filteredUsers = USERS.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.nrp.includes(search)
  );

  const totalPages = Math.ceil(filteredUsers.length / limit);

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * limit,
    page * limit
  );

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUser, setSelectedUser] =
    useState<UserTableRow | null>(null);

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
          Add User
        </Button>
      </div>

      {/* TABLE */}
      <div className="relative -mx-4 sm:mx-0">
        <div className="overflow-x-auto max-w-[calc(100vw-2rem)] sm:max-w-full">
          <Table className="min-w-[900px] text-blue-800">
            <TableHeader>
              <TableRow>
                <TableHead>NRP</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>Program Studi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.nrp}</TableCell>
                  <TableCell className="font-medium">
                    {user.nama}
                  </TableCell>
                  <TableCell>{user.angkatan}</TableCell>
                  <TableCell>{user.prodi}</TableCell>
                  <TableCell>
                    {user.status === "Aktif" ? (
                      <Badge variant="success">Aktif</Badge>
                    ) : (
                      <Badge variant="danger">Non Aktif</Badge>
                    )}
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-center">
                    <UserActionDropdown
                      onEdit={() => {
                        setSelectedUser(user);
                        setOpenEdit(true);
                      }}
                      onDelete={() => {
                        setSelectedUser(user);
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
      <AddUserModal open={openAdd} onClose={() => setOpenAdd(false)} />
      <EditUserModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
      />
      <DeleteUserModal
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
