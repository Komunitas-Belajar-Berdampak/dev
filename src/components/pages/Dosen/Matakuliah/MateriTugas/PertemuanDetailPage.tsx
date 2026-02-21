import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";

import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";

import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingsByCourse } from "../hooks/useMeetingsByCourse";
import { useMaterialsByCourse } from "../hooks/useMaterialsByCourse";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";

import { useCreateMaterial } from "../hooks/useCreateMaterial";
import { useCreateAssignment } from "../hooks/useCreateAssignment";

import PertemuanTabs from "./components/PertemuanTabs";
import MateriTugasItemRow from "./components/MateriTugasItemRow";
import MaterialModal from "./components/MaterialModal";
import AssignmentModal from "./components/AssignmentModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

import type { Assignment, Material } from "../types";

type MaterialInitial = {
  judul?: string;
  deskripsi?: string;
  namaFile?: string;
} | null;

type AssignmentInitial = {
  judul?: string;
  deskripsi?: string;
  namaFile?: string;
  startDate?: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
} | null;

export default function PertemuanDetailPage() {
  const { id, pertemuanId } = useParams<{ id: string; pertemuanId: string }>();

  const { data: course } = useMatakuliahDetail(id);
  const { data: meetings } = useMeetingsByCourse(id);

  const meeting = useMemo(() => {
    return (meetings ?? []).find((m) => String(m.id) === String(pertemuanId));
  }, [meetings, pertemuanId]);

  const pertemuanNumber = meeting?.pertemuan ?? null;

  const [tab, setTab] = useState<"materi" | "tugas">("materi");

  const pertemuanText =
    meeting?.pertemuan != null ? `Pertemuan ${meeting.pertemuan}` : "Pertemuan";

  const meetKey = useMemo(() => {
    const n = meeting?.pertemuan;
    if (!n) return null;
    return `meet${String(n).padStart(2, "0")}`;
  }, [meeting?.pertemuan]);

  const {
    data: materialsAll = [],
    isLoading: materialsLoading,
    error: materialsError,
  } = useMaterialsByCourse(id);

  const {
    data: assignmentsAll = [],
    isLoading: assignmentsLoading,
    error: assignmentsError,
  } = useAssignmentsByCourse(id);

  const materials = useMemo(() => {
    if (!meetKey) return materialsAll;
    return (materialsAll as any[]).filter((m) => {
      const p = String((m as any).pathFile ?? "");
      return p.includes(`/${meetKey}/`) || p.includes(`${meetKey}/`);
    });
  }, [materialsAll, meetKey]);

  const assignments = useMemo(() => {
    const n = meeting?.pertemuan;
    if (!n) return assignmentsAll;
    return (assignmentsAll as any[]).filter((a) => Number((a as any).pertemuan) === Number(n));
  }, [assignmentsAll, meeting?.pertemuan]);

  const items = tab === "materi" ? (materials as any[]) : (assignments as any[]);
  const loading = tab === "materi" ? materialsLoading : assignmentsLoading;
  const error = tab === "materi" ? materialsError : assignmentsError;

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: id ? `/dosen/courses/${id}` : undefined,
      },
      {
        label: "Materi & Tugas",
        href: id ? `/dosen/courses/${id}/materi-tugas` : undefined,
      },
      { label: pertemuanText },
    ],
    [course, id, pertemuanText]
  );

  const [openMaterialModal, setOpenMaterialModal] = useState(false);
  const [materialMode, setMaterialMode] = useState<"add" | "edit">("add");
  const [materialInitial, setMaterialInitial] = useState<MaterialInitial>(null);

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<"add" | "edit">("add");
  const [assignmentInitial, setAssignmentInitial] = useState<AssignmentInitial>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Material | Assignment | null>(null);

  const createMaterial = useCreateMaterial();
  const createAssignment = useCreateAssignment();

  const isSubmitting = createMaterial.isPending || createAssignment.isPending;

  const openAddModal = () => {
    if (tab === "materi") {
      setMaterialMode("add");
      setMaterialInitial(null);
      setOpenMaterialModal(true);
      return;
    }

    setAssignmentMode("add");
    setAssignmentInitial(null);
    setOpenAssignmentModal(true);
  };

  const openEditModal = (it: any) => {
    if (tab === "materi") {
      setMaterialMode("edit");
      setMaterialInitial({
        judul: it.namaFile ?? "",
        deskripsi: "",
        namaFile: it.namaFile ?? "",
      });
      setOpenMaterialModal(true);
      return;
    }

    setAssignmentMode("edit");
    setAssignmentInitial({
      judul: it.judul ?? "",
      deskripsi: "",
      namaFile: it.pathLampiran?.split("/").pop() ?? "",
      startDate: "",
      startTime: "10:30",
      endDate: "",
      endTime: "10:30",
    });
    setOpenAssignmentModal(true);
  };

  const requestDelete = (it: any) => {
    setDeleteTarget(it);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const name =
      tab === "materi"
        ? (deleteTarget as any).namaFile ?? "Materi"
        : (deleteTarget as any).judul ?? "Tugas";

    alert(`Delete (next step): ${name}`);
    setOpenDelete(false);
    setDeleteTarget(null);
  };

  const submitMaterial = (payload: { namaFile: string; file?: File | null; deskripsi: string }) => {
      if (!id) return alert("ID course tidak ditemukan");
      if (!pertemuanNumber) return alert("Pertemuan tidak ditemukan");
      if (!payload.namaFile?.trim()) return alert("Nama file materi wajib diisi");
      if (materialMode === "add" && !payload.file) return alert("File materi wajib diupload");

      if (materialMode === "edit") {
        return alert("Edit materi (PUT) nanti ya, sekarang fokus POST dulu.");
      }

      createMaterial.mutate(
        {
          idCourse: id,
          pertemuan: pertemuanNumber,
          payload: {
            file: payload.file as File,
            namaFile: payload.namaFile,
            status: "VISIBLE",
            deskripsi: payload.deskripsi,
          },
        },
        {
          onSuccess: () => setOpenMaterialModal(false),
          onError: () => alert("Gagal menambah materi"),
        }
      );
    };

  const submitAssignment = (payload: {
    judul: string;
    file?: File | null;
    deskripsi: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => {
    if (!id) return alert("ID course tidak ditemukan");
    if (!pertemuanNumber) return alert("Pertemuan tidak ditemukan");
    if (!payload.judul?.trim()) return alert("Judul tugas wajib diisi");
    if (!payload.endDate || !payload.endTime) return alert("Tenggat wajib diisi");
    if (assignmentMode === "add" && !payload.file) return alert("File tugas wajib diupload");

    if (assignmentMode === "edit") {
      return alert("Edit tugas (PUT) nanti ya, sekarang fokus POST dulu.");
    }

    const tenggatIso = new Date(`${payload.endDate}T${payload.endTime}:00`).toISOString();

    createAssignment.mutate(
      {
        idCourse: id,
        pertemuan: pertemuanNumber,
        payload: {
          judul: payload.judul,
          tenggat: tenggatIso,
          status: "VISIBLE",
          statusTugas: false,
          file: payload.file as File,
          deskripsi: payload.deskripsi,
        },
      },
      {
        onSuccess: () => setOpenAssignmentModal(false),
        onError: () => alert("Gagal menambah tugas"),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title
          title={course ? `${course.kodeMatkul} – ${course.namaMatkul}` : "Detail Mata Kuliah"}
          items={breadcrumbItems}
        />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10">
        <h2 className="text-center text-3xl font-bold text-primary">{pertemuanText}</h2>
      </div>

      <div className="flex items-center justify-between">
        <PertemuanTabs value={tab} onChange={setTab} />

        <Button
          type="button"
          disabled={isSubmitting}
          className="
            inline-flex items-center gap-2
            rounded-lg
            bg-blue-600
            px-4 py-2
            text-sm font-bold text-white
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all duration-150
            hover:translate-x-[1px] hover:translate-y-[1px]
            hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[2px] active:translate-y-[2px]
            active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            disabled:opacity-60
          "
          onClick={openAddModal}
        >
          <Icon icon="icon-park-solid:add" className="text-lg" />
          {tab === "materi" ? "Add Materi" : "Add Tugas"}
        </Button>
      </div>

      <div className="rounded-2xl bg-white">
        {loading && (
          <div className="py-10 text-center text-sm text-gray-500">Memuat data...</div>
        )}

        {!loading && error && (
          <div className="py-10 text-center text-sm text-red-600">Gagal memuat data.</div>
        )}

        {!loading &&
          !error &&
          items.map((it) => (
            <MateriTugasItemRow
              key={(it as any).id ?? (it as any)._id}
              type={tab}
              title={tab === "materi" ? (it as any).namaFile : (it as any).judul}
              onEdit={() => openEditModal(it)}
              onDelete={() => requestDelete(it)}
            />
          ))}

        {!loading && !error && items.length === 0 && (
          <div className="py-14 text-center text-sm text-gray-500">
            Belum ada {tab === "materi" ? "materi" : "tugas"} untuk pertemuan ini.
          </div>
        )}
      </div>

      <MaterialModal
        open={openMaterialModal}
        mode={materialMode}
        initial={materialInitial}
        onClose={() => setOpenMaterialModal(false)}
        onSubmit={submitMaterial}
      />

      <AssignmentModal
        open={openAssignmentModal}
        mode={assignmentMode}
        initial={assignmentInitial}
        onClose={() => setOpenAssignmentModal(false)}
        onSubmit={submitAssignment}
      />

      <ConfirmDeleteModal
        open={openDelete}
        title={`Apakah anda yakin menghapus ${tab === "materi" ? "materi" : "tugas"} ini ?`}
        description={
          tab === "materi"
            ? "Jika telah dihapus materi akan terhapus permanen"
            : "Jika telah dihapus tugas akan terhapus permanen"
        }
        onClose={() => {
          setOpenDelete(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}