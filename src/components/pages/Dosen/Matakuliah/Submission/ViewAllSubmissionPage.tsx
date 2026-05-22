import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmissions } from "../hooks/useSubmissions";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";
import { useDownloadSubmissions } from "../hooks/useDownloadSubmission";
import type { SubmissionItem } from "../services/submission.service";
import { SubmissionService } from "../services/submission.service";
import Title from "@/components/shared/Title";
import { Icon } from "@iconify/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_BASE_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

const PAGE_SIZE = 10;

function buildFileUrl(file?: string | null): string | undefined {
  if (!file) return undefined;
  if (/^https?:\/\//.test(file)) return file;
  return `${STORAGE_BASE_URL}/${file.replace(/^\/+/, "")}`;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  const btnBase =
    "inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold border border-black transition-all duration-150";
  const btnActive = "bg-primary text-white shadow-[2px_2px_0_0_#000]";
  const btnInactive =
    "bg-white text-gray-700 shadow-[2px_2px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_0_#000]";
  const btnDisabled =
    "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed shadow-none";

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${btnBase} ${currentPage === 1 ? btnDisabled : btnInactive}`}
        aria-label="Previous page"
      >
        <Icon icon="mdi:chevron-left" className="text-base" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnInactive}`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${btnBase} ${currentPage === totalPages ? btnDisabled : btnInactive}`}
        aria-label="Next page"
      >
        <Icon icon="mdi:chevron-right" className="text-base" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Download Button
// ---------------------------------------------------------------------------
function DownloadButton({
  assignmentId,
  zipName,
}: {
  assignmentId: string;
  zipName: string;
}) {
  const { state, download, isLoading } = useDownloadSubmissions();

  const getLabel = () => {
    switch (state.status) {
      case "fetching":
        return state.message;
      case "downloading":
        return `Mengunduh file... (${state.current}/${state.total})`;
      case "zipping":
        return state.message;
      case "done":
        return "Selesai!";
      case "error":
        return "Gagal, coba lagi";
      default:
        return "Download Semua";
    }
  };

  const getIcon = () => {
    switch (state.status) {
      case "done":
        return "mdi:check-circle-outline";
      case "error":
        return "mdi:alert-circle-outline";
      default:
        return isLoading ? "mdi:loading" : "mdi:download-outline";
    }
  };

  const progressPercent =
    state.status === "downloading" && state.total > 0
      ? Math.round((state.current / state.total) * 100)
      : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => download(assignmentId, zipName)}
        disabled={isLoading}
        className="
          relative overflow-hidden
          inline-flex items-center gap-2
          px-6 py-3 rounded-xl
          bg-white text-primary
          font-semibold text-sm
          border-2 border-black
          shadow-[4px_4px_0_0_#000]
          transition-all duration-150
          hover:translate-x-[2px] hover:translate-y-[2px]
          hover:shadow-[2px_2px_0_0_#000]
          active:translate-x-[4px] active:translate-y-[4px]
          active:shadow-none
          disabled:opacity-70 disabled:pointer-events-none
        "
      >
        {progressPercent !== null && (
          <span
            className="absolute inset-0 bg-primary/10 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        )}
        <Icon
          icon={getIcon()}
          className={`text-base relative z-10 ${
            isLoading && state.status !== "done" ? "animate-spin" : ""
          }`}
        />
        <span className="relative z-10">{getLabel()}</span>
      </button>

      {state.status === "downloading" && state.total > 0 && (
        <div className="w-48 h-1.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${Math.round((state.current / state.total) * 100)}%`,
            }}
          />
        </div>
      )}

      {state.status === "error" && (
        <p className="text-xs text-red-500">{state.message}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
export default function ViewAllSubmissionPage() {
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Pick<SubmissionItem, "id" | "mahasiswa" | "comment"> | null>(null);

  const { id: idCourse, assignmentId } = useParams<{
    id: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching, refetch } = useSubmissions(
    assignmentId,
    currentPage,
    PAGE_SIZE
  );

  const submissions: SubmissionItem[] = data?.data ?? [];
  const totalPages = data?.pagination?.total_pages ?? 1;
  const totalItems = data?.pagination?.total_items ?? 0;

  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);
  const assignment = (assignments as any[]).find(
    (a: any) => a.id === assignmentId
  );
  const judulTugas = assignment?.judul ?? "Tugas";

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------------------------------------
  // Buka dialog komentar — isi draft dari data server
  // -------------------------------------------------------------------------
  const handleOpenComment = (s: SubmissionItem) => {
    setSelectedSubmission(s);
    setCommentDraft(s.comment ?? "");
    setCommentDialogOpen(true);
  };

  const toastIconSuccess = (
  <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />
);

const toastIconError = (
  <Icon icon="lets-icons:cancel-fill" className="text-white text-lg shrink-0 mt-0.5" />
);

  // -------------------------------------------------------------------------
  // Simpan komentar ke server
  // -------------------------------------------------------------------------
  const handleSaveComment = async () => {
    if (!selectedSubmission?.id || !assignmentId) return;

    setIsSavingComment(true);
    try {
      await SubmissionService.updateComment(
        assignmentId,
        selectedSubmission.id,
        commentDraft.trim() || null
      );
      toast.success("Komentar berhasil disimpan!", {
        icon: toastIconSuccess,
        style: { background: "#16a34a", color: "#ffffff", border: "none" },
      });
      setCommentDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          err?.message ??
          "Gagal menyimpan komentar, coba lagi.",
        {
          icon: toastIconError,
          style: { background: "#dc2626", color: "#ffffff", border: "none" },
        }
      );
    } finally {
      setIsSavingComment(false);
    }
  };

  // -------------------------------------------------------------------------
  // Hapus komentar
  // -------------------------------------------------------------------------
  const handleDeleteComment = async () => {
    if (!selectedSubmission?.id || !assignmentId) return;

    setIsSavingComment(true);
    try {
      await SubmissionService.updateComment(
        assignmentId,
        selectedSubmission.id,
        null
      );
      toast.success("Komentar berhasil dihapus!", {
        icon: toastIconSuccess,
        style: { background: "#16a34a", color: "#ffffff", border: "none" },
      });
      setCommentDraft("");
      setCommentDialogOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ??
          err?.message ??
          "Gagal menghapus komentar, coba lagi.",
        {
          icon: toastIconError,
          style: { background: "#dc2626", color: "#ffffff", border: "none" },
        }
      );
    } finally {
      setIsSavingComment(false);
    }
  };

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    { label: judulTugas, href: `/dosen/courses/${idCourse}` },
    {
      label: "View Submission",
      href: `/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions`,
    },
    { label: "View All Submission" },
  ];

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------------ */}
      {/* Dialog Komentar                                                      */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-lg border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon
                icon="mdi:message-text-outline"
                className="text-2xl text-primary"
              />
              Komentar untuk Mahasiswa
            </DialogTitle>
            <DialogDescription>
              {selectedSubmission?.mahasiswa?.nama ?? "Mahasiswa"} (NRP:{" "}
              {selectedSubmission?.mahasiswa?.nrp ?? "-"})
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <label className="text-xs font-semibold text-primary">
              Isi komentar
            </label>
            <textarea
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              rows={5}
              disabled={isSavingComment}
              className="mt-2 w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60 disabled:cursor-not-allowed resize-none"
              placeholder="Tulis komentar dosen..."
            />
            <p className="mt-1 text-xs text-gray-400 text-right">
              {commentDraft.length} karakter
            </p>
          </div>

          <DialogFooter className="flex flex-wrap gap-2 sm:justify-between">
            {/* Tombol hapus — hanya muncul kalau sudah ada komentar */}
            {selectedSubmission?.comment && (
              <Button
                type="button"
                variant="outline"
                disabled={isSavingComment}
                className="border-2 border-red-300 text-red-500 hover:bg-red-50"
                onClick={handleDeleteComment}
              >
                <Icon
                  icon="mdi:trash-can-outline"
                  className="mr-1.5 text-base"
                />
                Hapus Komentar
              </Button>
            )}

            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                disabled={isSavingComment}
                className="border-2 border-black"
                onClick={() => setCommentDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="button"
                disabled={isSavingComment || commentDraft.trim() === ""}
                className="bg-primary text-white border-2 border-black shadow-[3px_3px_0_0_#000] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={handleSaveComment}
              >
                {isSavingComment ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="animate-spin mr-1.5 text-base"
                    />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Icon
                      icon="mdi:content-save-outline"
                      className="mr-1.5 text-base"
                    />
                    Simpan Komentar
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/* Header                                                               */}
      {/* ------------------------------------------------------------------ */}
      <Title title={judulTugas} items={breadcrumbItems} />

      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {judulTugas}
        </h2>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Tabel Submissions                                                    */}
      {/* ------------------------------------------------------------------ */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Icon icon="mdi:loading" className="animate-spin text-3xl text-primary" />
        </div>
      ) : (
        <>
          {totalItems > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500 px-1">
              <span>
                Menampilkan{" "}
                <span className="font-semibold text-gray-700">
                  {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, totalItems)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-gray-700">{totalItems}</span>{" "}
                submission
              </span>
              <span className="text-gray-400">
                Halaman {currentPage} / {totalPages}
              </span>
            </div>
          )}

          <div
            className={`rounded-2xl border-1 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden transition-opacity duration-150 ${
              isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-primary">
                    NRP
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-primary">
                    Nama
                  </th>
                  <th className="text-left px-6 py-3 font-semibold text-primary">
                    File Submission
                  </th>
                  <th className="text-right px-6 py-3 font-semibold text-primary">
                    Nilai
                  </th>
                  <th className="text-center px-6 py-3 font-semibold text-primary">
                    Comment
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      Belum ada submission.
                    </td>
                  </tr>
                ) : (
                  submissions.map((s: SubmissionItem, i: number) => {
                    const fileUrl = buildFileUrl(s.file);
                    const fileName =
                      s.file?.split("/").pop() ?? s.file ?? "-";
                    const hasComment = Boolean(s.comment);

                    return (
                      <tr
                        key={s.id ?? i}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-100"
                      >
                        {/* NRP */}
                        <td className="px-6 py-4 text-gray-700">
                          {s.mahasiswa?.nrp ?? "-"}
                        </td>

                        {/* Nama */}
                        <td className="px-6 py-4 text-gray-700">
                          {s.mahasiswa?.nama ?? "-"}
                        </td>

                        {/* File */}
                        <td className="px-6 py-4">
                          {fileUrl ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {fileName}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">
                              Tidak ada file
                            </span>
                          )}
                        </td>

                        {/* Nilai */}
                        <td className="px-6 py-4 text-right text-gray-700">
                          {s.grade ?? "-"}
                        </td>

                        {/* Comment button dengan badge indikator */}
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleOpenComment(s)}
                            className="relative inline-flex items-center justify-center group"
                            aria-label={
                              hasComment
                                ? "Lihat / edit komentar"
                                : "Beri komentar"
                            }
                            title={
                              hasComment
                                ? `Sudah dikomentari: "${s.comment}"`
                                : "Belum ada komentar"
                            }
                          >
                            <Icon
                              icon={
                                hasComment
                                  ? "mdi:message-text"
                                  : "mdi:message-text-outline"
                              }
                              className={`text-xl transition-all duration-150 group-hover:opacity-80 group-hover:scale-110 ${
                                hasComment ? "text-green-500" : "text-primary"
                              }`}
                            />
                            {hasComment && (
                              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Action Buttons                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-wrap justify-center gap-4 pt-2">
        {assignmentId && (
          <DownloadButton
            assignmentId={assignmentId}
            zipName={judulTugas.replace(/\s+/g, "_")}
          />
        )}

        <button
          onClick={() =>
            navigate(
              `/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions/all/edit`
            )
          }
          className="
            inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-primary text-white
            font-semibold text-sm
            border-2 border-black
            shadow-[4px_4px_0_0_#000]
            transition-all duration-150
            hover:translate-x-[2px] hover:translate-y-[2px]
            hover:shadow-[2px_2px_0_0_#000]
            active:translate-x-[4px] active:translate-y-[4px]
            active:shadow-none
          "
        >
          <Icon icon="mdi:pencil-outline" className="text-base" />
          Input Nilai
        </button>
      </div>
    </div>
  );
}