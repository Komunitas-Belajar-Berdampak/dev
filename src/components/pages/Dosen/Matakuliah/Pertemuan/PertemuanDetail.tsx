import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MeetingService, type MeetingEntity } from "../services/meeting.service";
import { Icon } from "@iconify/react";
import Title from "@/components/shared/Title";
import { useMeetingDetail } from "../hooks/useMeetingDetail";
import { useMaterialsByCourse } from "../hooks/useMaterialsByCourse";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";

function unwrapDeskripsi(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && typeof val.text === "string") return val.text;
  return String(val);
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div className={["animate-pulse rounded-md bg-gray-200/80", className].join(" ")} />
  );
}

function PertemuanDetailSkeleton() {
  return (
    <div className="space-y-8">
      <SkeletonBlock className="h-6 w-[300px]" />
      <SkeletonBlock className="h-20 w-full rounded-2xl" />
      <SkeletonBlock className="h-4 w-[80%]" />
      <SkeletonBlock className="h-4 w-[65%]" />
      <hr className="border-gray-200" />
      <div className="flex items-start gap-4">
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-[200px]" />
          <SkeletonBlock className="h-3 w-[90%]" />
        </div>
      </div>
      <hr className="border-gray-200" />
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-12 h-12 rounded-full" />
        <SkeletonBlock className="h-4 w-[180px]" />
      </div>
    </div>
  );
}

function PdfPreviewModal({
  url,
  title,
  onClose,
}: {
  url: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl"
        style={{ height: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h3 className="truncate max-w-[80%] text-sm font-semibold text-blue-900">{title}</h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
            >
              <Icon icon="mdi:download" className="text-sm" />
              Download
            </a>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
            >
              <Icon icon="mdi:close" className="text-xl" />
            </button>
          </div>
        </div>

        <iframe
          src={`${url}#toolbar=1&navpanes=0`}
          className="flex-1 w-full rounded-b-2xl"
          title={title}
        />
      </div>
    </div>
  );
}

export default function PertemuanDetail() {
  const { id: idCourse, pertemuanId } = useParams<{
    id: string;
    pertemuanId: string;
  }>();

  const { data: pertemuan, isLoading, error, refetch } = useMeetingDetail(pertemuanId, idCourse);
  const { data: materials = [] } = useMaterialsByCourse(idCourse);
  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);

  const navigate = useNavigate();

  const [allMeetings, setAllMeetings] = useState<MeetingEntity[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  useEffect(() => {
    if (!idCourse) return;
    MeetingService.getMeetingsByCourseId(idCourse)
      .then((list) => setAllMeetings(list.sort((a, b) => a.pertemuan - b.pertemuan)))
      .catch(() => {});
  }, [idCourse]);

  const currentIndex = allMeetings.findIndex((m) => m.id === pertemuanId);
  const prevMeeting = currentIndex > 0 ? allMeetings[currentIndex - 1] : null;
  const nextMeeting =
    currentIndex >= 0 && currentIndex < allMeetings.length - 1
      ? allMeetings[currentIndex + 1]
      : null;

  const pertemuanNum = Number(pertemuan?.pertemuan ?? 0);

  const materiPertemuan = pertemuanNum
    ? (materials as any[]).filter((m: any) => {
        if (m.idMeeting) return String(m.idMeeting) === String(pertemuanId);
        const meetKey = `meet${String(pertemuanNum).padStart(2, "0")}`;
        const p = String(m.pathFile ?? "");
        return p.includes(`/${meetKey}/`) || p.includes(`${meetKey}/`);
      })
    : (materials as any[]);

  const tugasPertemuan = (assignments as any[]).filter(
    (a: any) => String(a.idMeeting) === String(pertemuanId)
  );

  const openPreview = (url: string, title: string) => {
    setPreviewTitle(title);
    setPreviewUrl(url);
  };

  const closePreview = () => {
    setPreviewUrl(null);
    setPreviewTitle("");
  };

  if (isLoading) return <PertemuanDetailSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => void refetch()}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:opacity-90 transition text-sm"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!pertemuan) {
    return (
      <p className="text-sm text-gray-500 text-center">Pertemuan tidak ditemukan.</p>
    );
  }

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    {
      label: pertemuan.judul ?? "Detail Matakuliah",
      href: `/dosen/courses/${idCourse}`,
    },
    { label: `Pertemuan ${pertemuan.pertemuan}` },
  ];

  return (
    <div className="space-y-8">
      <Title
        title={`Pertemuan ${pertemuan.pertemuan} – ${pertemuan.judul}`}
        items={breadcrumbItems}
      />

      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Pertemuan {pertemuan.pertemuan} – {pertemuan.judul}
        </h2>
      </div>

      {pertemuan.deskripsi && (
        <div className="text-blue-900 text-base max-w-full">
          <p>{unwrapDeskripsi(pertemuan.deskripsi)}</p>
        </div>
      )}

      <hr className="border-gray-200" />

      {/* MATERI */}
      <div className="space-y-4">
        <h3 className="font-semibold text-blue-900 text-lg">Materi</h3>

        {materiPertemuan.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada materi untuk pertemuan ini.</p>
        ) : (
          materiPertemuan.map((m: any, idx: number) => {
            const fileUrl = m.pathFile ?? m.fileUrl ?? m.url ?? null;
            const namaFile = m.namaFile ?? m.judul ?? "Materi";
            const deskripsiText = unwrapDeskripsi(m.deskripsi);

            return (
              <div key={m.id ?? idx} className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
                  <Icon icon="mdi:file-document-outline" className="text-2xl text-blue-800" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-blue-900">
                    Materi {idx + 1} – {namaFile}
                  </h4>
                  {deskripsiText && (
                    <p className="text-sm text-blue-900 max-w-xl">{deskripsiText}</p>
                  )}
                </div>
                {fileUrl ? (
                  <button
                    onClick={() => openPreview(fileUrl, namaFile)}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                  >
                    <Icon icon="mdi:eye-outline" className="text-base" />
                    Preview
                  </button>
                ) : (
                  <span className="shrink-0 text-xs text-gray-400 italic">File tidak tersedia</span>
                )}
              </div>
            );
          })
        )}
      </div>

      <hr className="border-gray-200" />

      {/* TUGAS */}
      <div className="space-y-4">
        <h3 className="font-semibold text-blue-900 text-lg">Tugas</h3>

        {tugasPertemuan.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada tugas untuk pertemuan ini.</p>
        ) : (
          tugasPertemuan.map((t: any, idx: number) => {
            const lampiranUrl = t.lampiran ?? t.pathLampiran ?? null;
            const deskripsiText = unwrapDeskripsi(t.deskripsi);

            return (
              <div key={t.id ?? idx} className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 shrink-0">
                    <Icon icon="mdi:clipboard-check-outline" className="text-2xl text-pink-700" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-semibold text-blue-900">
                      Tugas {idx + 1} – {t.judul}
                    </h4>
                    {deskripsiText && (
                      <p className="text-sm text-blue-900 max-w-xl">{deskripsiText}</p>
                    )}
                    {t.tenggat && (
                      <p className="text-xs text-gray-500">
                        Tenggat:{" "}
                        {new Date(t.tenggat).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {lampiranUrl && (
                    <button
                      onClick={() => openPreview(lampiranUrl, t.judul ?? "Lampiran Tugas")}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                    >
                      <Icon icon="mdi:eye-outline" className="text-base" />
                      Preview
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/dosen/courses/${idCourse}/pertemuan/${t.id}/submissions`)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-blue-900 hover:bg-gray-50 transition"
                  >
                    View Submission
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PREV / NEXT */}
      <div className="fixed bottom-12 left-0 right-0 z-40 flex justify-between px-12 pointer-events-none">
        {prevMeeting ? (
          <button
            onClick={() => navigate(`/dosen/courses/${idCourse}/pertemuan/${prevMeeting.id}`)}
            className="pointer-events-auto flex items-center gap-2 text-blue-900 hover:opacity-70 transition"
          >
            <Icon icon="mdi:chevron-left" className="text-xl" />
            <span className="text-sm">Pertemuan {prevMeeting.pertemuan}</span>
          </button>
        ) : (
          <div />
        )}

        {nextMeeting ? (
          <button
            onClick={() => navigate(`/dosen/courses/${idCourse}/pertemuan/${nextMeeting.id}`)}
            className="pointer-events-auto flex items-center gap-2 text-blue-900 hover:opacity-70 transition"
          >
            <span className="text-sm">Pertemuan {nextMeeting.pertemuan}</span>
            <Icon icon="mdi:chevron-right" className="text-xl" />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* PDF PREVIEW MODAL */}
      {previewUrl && (
        <PdfPreviewModal
          url={previewUrl}
          title={previewTitle}
          onClose={closePreview}
        />
      )}
    </div>
  );
}