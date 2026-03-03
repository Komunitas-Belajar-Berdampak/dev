import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MeetingService, type MeetingEntity } from "../services/meeting.service";
import { Icon } from "@iconify/react";
import Title from "@/components/shared/Title";
import { useMeetingDetail } from "../hooks/useMeetingDetail";
import { useMaterialsByCourse } from "../hooks/useMaterialsByCourse";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";

// Helper: unwrap deskripsi dari BE yang bisa berupa { text: "..." } atau string biasa
function unwrapDeskripsi(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && typeof val.text === "string") return val.text;
  return String(val);
}

// Helper: build URL download dari pathFile
// pathFile di DB: "materials/IF101/meet01/namafile.pdf"
// URL final:      "http://localhost:3002/materials/IF101/meet01/namafile.pdf"
const STORAGE_BASE_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

function buildFileUrl(pathFile?: string | null): string | undefined {
  if (!pathFile) return undefined;
  // Kalau sudah full URL (http/https), langsung pakai
  if (/^https?:\/\//.test(pathFile)) return pathFile;
  // Gabungkan base URL + path (hindari double slash)
  const cleanPath = pathFile.replace(/^\/+/, "");
  return `${STORAGE_BASE_URL}/${cleanPath}`;
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

export default function PertemuanDetail() {
  const { id: idCourse, pertemuanId } = useParams<{
    id: string;
    pertemuanId: string;
  }>();

  const {
    data: pertemuan,
    isLoading,
    error,
    refetch,
  } = useMeetingDetail(pertemuanId, idCourse);

  const { data: materials = [] } = useMaterialsByCourse(idCourse);
  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);

  const navigate = useNavigate();

  // Fetch semua pertemuan untuk navigasi prev/next
  const [allMeetings, setAllMeetings] = useState<MeetingEntity[]>([]);
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

  // FIX 1: Filter materi — coba berdasarkan field "pertemuan" dulu,
  // fallback ke pathFile pattern jika field tidak ada
  const meetKey = pertemuanNum
    ? `meet${String(pertemuanNum).padStart(2, "0")}`
    : null;

  const materiPertemuan = pertemuanNum
    ? (materials as any[]).filter((m: any) => {
        // Prioritas: field pertemuan langsung
        if (m.pertemuan !== undefined && m.pertemuan !== null) {
          return Number(m.pertemuan) === pertemuanNum;
        }
        // Fallback: pathFile pattern (meet01, meet02, dst)
        if (meetKey) {
          const p = String(m.pathFile ?? "");
          return p.includes(`/${meetKey}/`) || p.includes(`${meetKey}/`);
        }
        return false;
      })
    : (materials as any[]);

  // Filter tugas per pertemuan
  const tugasPertemuan = (assignments as any[]).filter(
    (a: any) => Number(a.pertemuan) === pertemuanNum
  );

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
      <p className="text-sm text-gray-500 text-center">
        Pertemuan tidak ditemukan.
      </p>
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
      {/* TITLE + BREADCRUMB */}
      <Title
        title={`Pertemuan ${pertemuan.pertemuan} – ${pertemuan.judul}`}
        items={breadcrumbItems}
      />

      {/* PERTEMUAN TITLE CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
          Pertemuan {pertemuan.pertemuan} – {pertemuan.judul}
        </h2>
      </div>

      {/* FIX 2: Unwrap deskripsi pertemuan (bisa berupa object { text: "..." }) */}
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
            // FIX 3: Build full URL dari pathFile (path relatif di DB)
            const downloadUrl = buildFileUrl(m.pathFile ?? m.fileUrl ?? m.url);

            const deskripsiText = unwrapDeskripsi(m.deskripsi);

            return (
              <div key={m.id ?? idx} className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 shrink-0">
                  <Icon
                    icon="mdi:file-document-outline"
                    className="text-2xl text-blue-800"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-900">
                    Materi {idx + 1} – {m.namaFile ?? m.judul ?? "Materi"}
                  </h4>
                  {deskripsiText && (
                    <p className="text-sm text-blue-900 max-w-xl">{deskripsiText}</p>
                  )}
                  {/* FIX 4: Tampilkan tombol download jika ada URL */}
                  {downloadUrl ? (
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <Icon icon="mdi:download" />
                      Download
                    </a>
                  ) : (
                    <p className="text-xs text-gray-400 italic">File tidak tersedia</p>
                  )}
                </div>
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
            // FIX 5: Build full URL lampiran dari field "lampiran" (path relatif di DB)
            const lampiranUrl = buildFileUrl(t.lampiran ?? t.pathLampiran ?? t.fileUrl);

            const deskripsiText = unwrapDeskripsi(t.deskripsi);

            return (
              <div
                key={t.id ?? idx}
                className="flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 shrink-0">
                    <Icon
                      icon="mdi:clipboard-check-outline"
                      className="text-2xl text-pink-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-blue-900">
                      Tugas {idx + 1} – {t.judul}
                    </h4>
                    {/* FIX 6: Unwrap deskripsi tugas */}
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
                    {/* FIX 7: Tampilkan download lampiran jika ada */}
                    {lampiranUrl && (
                      <a
                        href={lampiranUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <Icon icon="mdi:download" />
                        Download Lampiran
                      </a>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => navigate(`/dosen/courses/${idCourse}/pertemuan/${t.id}/submissions`)}
                  className="text-sm text-blue-900 hover:underline shrink-0">
                  View Submission
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* PREV / NEXT NAVIGATION */}
      <div className="fixed bottom-12 left-0 right-0 z-50 flex justify-between px-12 pointer-events-none">
        {/* PREV */}
        {prevMeeting ? (
          <button
            onClick={() => navigate(`/dosen/courses/${idCourse}/pertemuan/${prevMeeting.id}`)}
            className="pointer-events-auto flex items-center gap-2 text-blue-900 hover:opacity-70 transition"
          >
            <Icon icon="mdi:chevron-left" className="text-xl" />
            <span className="text-sm">
              Pertemuan {prevMeeting.pertemuan}
            </span>
          </button>
        ) : (
          <div />
        )}

        {/* NEXT */}
        {nextMeeting ? (
          <button
            onClick={() => navigate(`/dosen/courses/${idCourse}/pertemuan/${nextMeeting.id}`)}
            className="pointer-events-auto flex items-center gap-2 text-blue-900 hover:opacity-70 transition"
          >
            <span className="text-sm">
              Pertemuan {nextMeeting.pertemuan}
            </span>
            <Icon icon="mdi:chevron-right" className="text-xl" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}