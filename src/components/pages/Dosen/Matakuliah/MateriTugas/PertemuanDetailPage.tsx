import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingsByCourse } from "../hooks/useMeetingsByCourse";
import { useMaterialsByCourse } from "../hooks/useMaterialsByCourse";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";
import { useCreateMaterial } from "../hooks/useCreateMaterial";
import { useCreateAssignment } from "../hooks/useCreateAssignment";
import { useUpdateMaterial } from "../hooks/useUpdateMaterial";
import { useDeleteMaterial } from "../hooks/useDeleteMaterial";
import { useUpdateAssignment } from "../hooks/useUpdateAssignment";
import { useDeleteAssignment } from "../hooks/useDeleteAssignment";
import PertemuanTabs from "./components/PertemuanTabs";
import MateriTugasItemRow from "./components/MateriTugasItemRow";
import MaterialModal, { type MaterialFormPayload } from "./components/MaterialModal";
import AssignmentModal, { type AssignmentFormPayload } from "./components/AssignmentModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

const errorIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />
);
const errorStyle = { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" };
const successIcon = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />
);
const successStyle = { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" };

function extractErrorMessage(err: any): string {
  const data = err?.response?.data;
  if (typeof data === "string" && data.length > 0) return data;
  if (typeof data?.message === "string" && data.message.length > 0) return data.message;
  if (typeof data?.error === "string" && data.error.length > 0) return data.error;
  if (typeof err?.message === "string" && err.message.length > 0) return err.message;
  return "";
}

function toastError(title: string, err?: any, fallback?: string) {
  const msg = err ? extractErrorMessage(err) : "";
  toast.error(title, {
    description: msg || fallback || "Terjadi kesalahan pada server. Silakan coba lagi.",
    icon: errorIcon,
    style: errorStyle,
    descriptionClassName: "!text-white/90",
  });
}

function toastSuccess(title: string, description: string) {
  toast.success(title, {
    description,
    icon: successIcon,
    style: successStyle,
    descriptionClassName: "!text-white/90",
  });
}

export default function PertemuanDetailPage() {
  const { id, pertemuanId } = useParams<{ id: string; pertemuanId: string }>();

  const { data: course } = useMatakuliahDetail(id);
  const { data: meetings } = useMeetingsByCourse(id);

  const meeting = useMemo(
    () => (meetings ?? []).find((m) => String(m.id) === String(pertemuanId)),
    [meetings, pertemuanId]
  );

  const pertemuanNumber = meeting?.pertemuan ?? null;
  const [tab, setTab] = useState<"materi" | "tugas">("materi");
  const pertemuanText =
    meeting?.pertemuan != null ? `Pertemuan ${meeting.pertemuan}` : "Pertemuan";

  const meetKey = useMemo(() => {
    const n = meeting?.pertemuan;
    if (!n) return null;
    return `meet${String(n).padStart(2, "0")}`;
  }, [meeting?.pertemuan]);

  const { data: materialsAll = [], isLoading: materialsLoading, error: materialsError } =
    useMaterialsByCourse(id);
  const { data: assignmentsAll = [], isLoading: assignmentsLoading, error: assignmentsError } =
    useAssignmentsByCourse(id);

  const materials = useMemo(() => {
    if (!meeting) return materialsAll;
    const meetingId = meeting.id ?? (meeting as any)._id;
    return (materialsAll as any[]).filter((m) => {
      // Prioritaskan match by idMeeting kalau ada di response
      if (m.idMeeting) return String(m.idMeeting) === String(meetingId);
      // Fallback: cocokkan via meetKey di pathFile (backward-compat)
      if (!meetKey) return true;
      const p = String(m.pathFile ?? "");
      return p.includes(`/${meetKey}/`) || p.includes(`${meetKey}/`);
    });
  }, [materialsAll, meeting, meetKey]);

  const assignments = useMemo(() => {
    const n = meeting?.pertemuan;
    if (!n) return assignmentsAll;
    return (assignmentsAll as any[]).filter(
      (a) => Number((a as any).pertemuan) === Number(n)
    );
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
  const [materialInitial, setMaterialInitial] = useState<
    Parameters<typeof MaterialModal>[0]["initial"]
  >(null);
  const [editingMaterialId, setEditingMaterialId] = useState<string | null>(null);

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<"add" | "edit">("add");
  const [assignmentInitial, setAssignmentInitial] = useState<
    Parameters<typeof AssignmentModal>[0]["initial"]
  >(null);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);

  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const deleteMaterial = useDeleteMaterial(id);
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  const deleteAssignment = useDeleteAssignment(id);

  const isSubmitting =
    createMaterial.isPending ||
    updateMaterial.isPending ||
    createAssignment.isPending ||
    updateAssignment.isPending;

  const openAddModal = () => {
    if (tab === "materi") {
      setMaterialMode("add");
      setMaterialInitial(null);
      setEditingMaterialId(null);
      setOpenMaterialModal(true);
    } else {
      setAssignmentMode("add");
      setAssignmentInitial(null);
      setEditingAssignmentId(null);
      setOpenAssignmentModal(true);
    }
  };

  const openEditModal = (it: any) => {
    if (tab === "materi") {
      setMaterialMode("edit");
      setEditingMaterialId(it.id ?? it._id);
      setMaterialInitial({
        namaFile: it.namaFile ?? "",
        visibility: it.visibility ?? "VISIBLE",
        deskripsi: it.deskripsi?.text ?? it.deskripsi ?? "",
      });
      setOpenMaterialModal(true);
    } else {
      setAssignmentMode("edit");
      setEditingAssignmentId(it.id ?? it._id);
      const tenggatDate = it.tenggat ? new Date(it.tenggat) : null;
      const endDate = tenggatDate ? tenggatDate.toISOString().split("T")[0] : "";
      const endTime = tenggatDate ? tenggatDate.toTimeString().slice(0, 5) : "10:30";

      const lampiranRaw: string = it.lampiran ?? it.pathLampiran ?? "";
      const lampiranNama = lampiranRaw ? lampiranRaw.split("/").pop() : "";

      setAssignmentInitial({
        judul: it.judul ?? "",
        deskripsi: it.deskripsi?.text ?? it.deskripsi ?? "",
        lampiranNama,
        endDate,
        endTime,
        statusTugas: it.statusTugas === true || it.statusTugas === "kelompok",
        status: it.status ?? "VISIBLE",
      });
      setOpenAssignmentModal(true);
    }
  };

  const requestDelete = (it: any) => {
    setDeleteTarget(it);
    setOpenDelete(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (tab === "materi") {
      deleteMaterial.mutate(deleteTarget.id ?? deleteTarget._id, {
        onSuccess: () => {
          setOpenDelete(false);
          setDeleteTarget(null);
          toastSuccess("Materi Berhasil Dihapus!", "Materi telah dihapus secara permanen.");
        },
        onError: (err: any) => toastError("Gagal Menghapus Materi!", err),
      });
    } else {
      deleteAssignment.mutate(deleteTarget.id ?? deleteTarget._id, {
        onSuccess: () => {
          setOpenDelete(false);
          setDeleteTarget(null);
          toastSuccess("Tugas Berhasil Dihapus!", "Tugas telah dihapus secara permanen.");
        },
        onError: (err: any) => toastError("Gagal Menghapus Tugas!", err),
      });
    }
  };

  const submitMaterial = (payload: MaterialFormPayload) => {
    if (!id) {
      toastError("ID Course Tidak Ditemukan!", undefined, "Silakan refresh halaman dan coba lagi.");
      return;
    }
    if (!pertemuanNumber) {
      toastError("Pertemuan Tidak Ditemukan!", undefined, "Silakan refresh halaman dan coba lagi.");
      return;
    }

    if (materialMode === "edit") {
      if (!editingMaterialId) return;
      updateMaterial.mutate(
        {
          idMaterial: editingMaterialId,
          payload: {
            file: payload.file,
            namaFile: payload.namaFile,
            visibility: payload.visibility,
            deskripsi: payload.deskripsi,
          },
        },
        {
          onSuccess: () => {
            setOpenMaterialModal(false);
            toastSuccess("Materi Berhasil Diperbarui!", `"${payload.namaFile}" berhasil disimpan.`);
          },
          onError: (err: any) => toastError("Gagal Memperbarui Materi!", err),
        }
      );
      return;
    }

    if (!payload.file) {
      toastError("File Wajib Dipilih!", undefined, "Silakan pilih file materi terlebih dahulu.");
      return;
    }

    createMaterial.mutate(
      {
        idCourse: id,
        pertemuan: pertemuanNumber,
        payload: {
          file: payload.file,
          namaFile: payload.namaFile,
          visibility: payload.visibility,
          deskripsi: payload.deskripsi,
        },
      },
      {
        onSuccess: () => {
          setOpenMaterialModal(false);
          toastSuccess("Materi Berhasil Ditambahkan!", `"${payload.namaFile}" berhasil ditambahkan.`);
        },
        onError: (err: any) => toastError("Gagal Menambahkan Materi!", err),
      }
    );
  };

  const submitAssignment = (payload: AssignmentFormPayload) => {
    if (!id) {
      toastError("ID Course Tidak Ditemukan!", undefined, "Silakan refresh halaman dan coba lagi.");
      return;
    }
    if (!pertemuanNumber) {
      toastError("Pertemuan Tidak Ditemukan!", undefined, "Silakan refresh halaman dan coba lagi.");
      return;
    }
    if (!payload.judul?.trim()) {
      toastError("Judul Tugas Wajib Diisi!", undefined, "Silakan isi judul tugas sebelum melanjutkan.");
      return;
    }
    if (!payload.tenggat) {
      toastError("Tenggat Wajib Diisi!", undefined, "Silakan pilih tanggal dan jam tenggat pengumpulan.");
      return;
    }

    if (assignmentMode === "edit") {
      if (!editingAssignmentId) return;
      updateAssignment.mutate(
        {
          idAssignment: editingAssignmentId,
          payload: {
            judul: payload.judul,
            statusTugas: payload.statusTugas,
            tenggat: payload.tenggat,
            status: payload.status,
            file: payload.file,
            deskripsi: payload.deskripsi,
          },
        },
        {
          onSuccess: () => {
            setOpenAssignmentModal(false);
            toastSuccess("Tugas Berhasil Diperbarui!", `"${payload.judul}" berhasil disimpan.`);
          },
          onError: (err: any) => toastError("Gagal Memperbarui Tugas!", err),
        }
      );
      return;
    }

    createAssignment.mutate(
      {
        idCourse: id,
        pertemuan: pertemuanNumber,
        payload: {
          judul: payload.judul,
          statusTugas: payload.statusTugas,
          tenggat: payload.tenggat,
          status: payload.status,
          file: payload.file,
          deskripsi: payload.deskripsi,
        },
      },
      {
        onSuccess: () => {
          setOpenAssignmentModal(false);
          toastSuccess("Tugas Berhasil Ditambahkan!", `"${payload.judul}" berhasil ditambahkan.`);
        },
        onError: (err: any) => toastError("Gagal Menambahkan Tugas!", err),
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
          onClick={openAddModal}
          className="
            inline-flex items-center gap-2
            rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white
            shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
            transition-all duration-150
            hover:translate-x-[1px] hover:translate-y-[1px]
            hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
            active:translate-x-[2px] active:translate-y-[2px]
            active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
            disabled:opacity-60
          "
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
        {!loading && !error && items.length === 0 && (
          <div className="mt-6 flex flex-col items-center justify-center py-16 text-center">
            <Icon
              icon={tab === "materi" ? "mdi:file-document-outline" : "mdi:clipboard-text-outline"}
              className="text-7xl text-gray-200"
            />
            <p className="mt-6 text-lg font-bold text-blue-900">
              {tab === "materi" ? "Belum Ada Materi" : "Belum Ada Tugas"}
            </p>
            <p className="mt-2 text-sm text-gray-500 max-w-sm">
              {tab === "materi"
                ? "Tambahkan materi untuk pertemuan ini agar mahasiswa dapat mengaksesnya."
                : "Belum ada tugas yang ditambahkan untuk pertemuan ini."}
            </p>
          </div>
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
        title={`Apakah anda yakin menghapus ${tab === "materi" ? "materi" : "tugas"} ini?`}
        description={
          tab === "materi"
            ? "Jika telah dihapus materi akan terhapus permanen"
            : "Jika telah dihapus tugas akan terhapus permanen"
        }
        loading={deleteMaterial.isPending || deleteAssignment.isPending}
        onClose={() => {
          setOpenDelete(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}