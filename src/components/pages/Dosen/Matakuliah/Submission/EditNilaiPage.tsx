import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSubmissions } from "../hooks/useSubmissions";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";
import { SubmissionService } from "../services/submission.service";
import Title from "@/components/shared/Title";
import { Icon } from "@iconify/react";

const STORAGE_BASE_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

const PAGE_SIZE = 10;

function buildFileUrl(file?: string | null): string | undefined {
  if (!file) return undefined;
  if (/^https?:\/\//.test(file)) return file;
  return `${STORAGE_BASE_URL}/${file.replace(/^\/+/, "")}`;
}

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

export default function EditNilaiPage() {
  const { id: idCourse, assignmentId } = useParams<{
    id: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  // nilaiMap persists across pages: { [submissionId]: nilai }
  const [nilaiMap, setNilaiMap] = useState<Record<string, string>>({});
  const [isSavingAll, setIsSavingAll] = useState(false);

  const { data, isLoading, isFetching } = useSubmissions(
    assignmentId,
    currentPage,
    PAGE_SIZE
  );

  const submissions = data?.data ?? [];
  const totalPages = data?.pagination?.total_pages ?? 1;
  const totalItems = data?.pagination?.total_items ?? 0;

  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);
  const assignment = (assignments as any[]).find((a: any) => a.id === assignmentId);
  const judulTugas = assignment?.judul ?? "Tugas";

  // Seed nilaiMap with existing grades for newly loaded page entries
  // (won't overwrite values already edited by user)
  useEffect(() => {
    if (submissions.length > 0) {
      setNilaiMap((prev) => {
        const next = { ...prev };
        submissions.forEach((s: any) => {
          if (!(s.id in next)) {
            next[s.id] = s.grade != null ? String(s.grade) : "";
          }
        });
        return next;
      });
    }
  }, [submissions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveAll = async () => {
    if (!assignmentId) return;
    setIsSavingAll(true);

    // Only save entries that have a valid numeric value
    const toSave = Object.entries(nilaiMap).filter(
      ([, val]) => val !== "" && !isNaN(Number(val))
    );

    try {
      await Promise.all(
        toSave.map(([id, val]) =>
          SubmissionService.updateGrade(assignmentId, id, Number(val))
        )
      );

      toast.success("Nilai Berhasil Disimpan!", {
        description: `${toSave.length} nilai mahasiswa berhasil diperbarui.`,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5" />,
        style: { background: "#16a34a", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });

      setTimeout(() => {
        navigate(`/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions/all`);
      }, 800);
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Gagal menyimpan nilai.";
      toast.error("Gagal Menyimpan Nilai!", {
        description: msg,
        icon: <Icon icon="lets-icons:check-fill" className="text-white text-lg shrink-0 mt-0.5 rotate-45" />,
        style: { background: "#dc2626", color: "#ffffff", border: "none", alignItems: "flex-start" },
        descriptionClassName: "!text-white/90",
      });
    } finally {
      setIsSavingAll(false);
    }
  };

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    { label: judulTugas, href: `/dosen/courses/${idCourse}` },
    {
      label: "View Submission",
      href: `/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions`,
    },
    {
      label: "View All Submission",
      href: `/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions/all`,
    },
    { label: "Edit Nilai" },
  ];

  return (
    <div className="space-y-8">
      <Title title={judulTugas} items={breadcrumbItems} />

      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {judulTugas}
        </h2>
      </div>

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
                  <th className="text-left px-6 py-3 font-semibold text-primary">NRP</th>
                  <th className="text-left px-6 py-3 font-semibold text-primary">Nama</th>
                  <th className="text-left px-6 py-3 font-semibold text-primary">File Submission</th>
                  <th className="text-right px-6 py-3 font-semibold text-primary">Nilai</th>
                </tr>
              </thead>
              <tbody>
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      Belum ada submission.
                    </td>
                  </tr>
                ) : (
                  submissions.map((s: any, i: number) => {
                    const fileUrl = buildFileUrl(s.file);
                    const fileName = s.file?.split("/").pop() ?? s.file ?? "-";
                    return (
                      <tr key={s.id ?? i} className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-4 text-gray-700">{s.mahasiswa?.nrp ?? "-"}</td>
                        <td className="px-6 py-4 text-gray-700">{s.mahasiswa?.nama ?? "-"}</td>
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
                            <span className="text-gray-400 italic">Tidak ada file</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={nilaiMap[s.id] ?? ""}
                            onChange={(e) =>
                              setNilaiMap((prev) => ({
                                ...prev,
                                [s.id]: e.target.value,
                              }))
                            }
                            className="w-16 text-right border border-gray-200 rounded-lg px-2 py-1 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-blue-300"
                          />
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

      <div className="flex justify-center pt-2">
        <button
          onClick={handleSaveAll}
          disabled={isSavingAll}
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
            disabled:opacity-60 disabled:pointer-events-none
          "
        >
          {isSavingAll
            ? <Icon icon="mdi:loading" className="animate-spin text-base" />
            : <Icon icon="mdi:content-save-outline" className="text-base" />
          }
          Simpan Nilai
        </button>
      </div>
    </div>
  );
}