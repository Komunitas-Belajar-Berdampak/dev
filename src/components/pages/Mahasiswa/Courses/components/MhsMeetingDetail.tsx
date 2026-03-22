import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  MeetingService,
  type MeetingEntity,
} from "@/components/pages/Dosen/Matakuliah/services/meeting.service";
import { Icon } from "@iconify/react";
import Title from "@/components/shared/Title";
import { useMeetingDetail } from "@/components/pages/Dosen/Matakuliah/hooks/useMeetingDetail";
import { useMaterialsByCourse } from "@/components/pages/Dosen/Matakuliah/hooks/useMaterialsByCourse";
import { useAssignmentsByCourse } from "@/components/pages/Dosen/Matakuliah/hooks/useAssignmentsByCourse";
import { Button } from "@/components/ui/button";

function unwrapDeskripsi(val: any): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && typeof val.text === "string") return val.text;
  return String(val);
}

const STORAGE_BASE_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

function buildFileUrl(pathFile?: string | null): string | undefined {
  if (!pathFile) return undefined;
  if (/^https?:\/\//.test(pathFile)) return pathFile;
  const cleanPath = pathFile.replace(/^\/+/, "");
  return `${STORAGE_BASE_URL}/${cleanPath}`;
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-gray-200/80", className].join(
        " ",
      )}
    />
  );
}

function MeetingDetailSkeleton() {
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

const MhsMeetingDetail = () => {
  const { idMatkul: idCourse, idMeeting } = useParams<{
    idMatkul: string;
    idMeeting: string;
  }>();
  const navigate = useNavigate();

  const {
    data: pertemuan,
    isLoading,
    error,
    refetch,
  } = useMeetingDetail(idMeeting, idCourse);
  const { data: materials = [] } = useMaterialsByCourse(idCourse);
  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);

  const [allMeetings, setAllMeetings] = useState<MeetingEntity[]>([]);
  useEffect(() => {
    if (!idCourse) return;
    MeetingService.getMeetingsByCourseId(idCourse)
      .then((list) =>
        setAllMeetings(list.sort((a, b) => a.pertemuan - b.pertemuan)),
      )
      .catch(() => {});
  }, [idCourse]);

  const currentIndex = allMeetings.findIndex((m) => m.id === idMeeting);
  const prevMeeting = currentIndex > 0 ? allMeetings[currentIndex - 1] : null;
  const nextMeeting =
    currentIndex >= 0 && currentIndex < allMeetings.length - 1
      ? allMeetings[currentIndex + 1]
      : null;

  const pertemuanNum = Number(pertemuan?.pertemuan ?? 0);
  const meetKey = pertemuanNum
    ? `meet${String(pertemuanNum).padStart(2, "0")}`
    : null;

  const materiPertemuan = pertemuanNum
    ? (materials as any[]).filter((m: any) => {
        if (m.pertemuan !== undefined && m.pertemuan !== null) {
          return Number(m.pertemuan) === pertemuanNum;
        }
        if (meetKey) {
          const p = String(m.pathFile ?? "");
          return p.includes(`/${meetKey}/`) || p.includes(`${meetKey}/`);
        }
        return false;
      })
    : (materials as any[]);

  const tugasPertemuan = (assignments as any[]).filter(
    (a: any) => Number(a.pertemuan) === pertemuanNum,
  );

  if (isLoading) return <MeetingDetailSkeleton />;

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
    { label: "Courses", href: "/mahasiswa/courses" },
    {
      label: pertemuan.judul ?? "Detail Matakuliah",
      href: `/mahasiswa/courses/${idCourse}`,
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
          <p className="text-sm text-gray-500">
            Belum ada materi untuk pertemuan ini.
          </p>
        ) : (
          materiPertemuan.map((m: any, idx: number) => {
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
                    <p className="text-sm text-blue-900 max-w-xl">
                      {deskripsiText}
                    </p>
                  )}
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
                    <p className="text-xs text-gray-400 italic">
                      File tidak tersedia
                    </p>
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
          <p className="text-sm text-gray-500">
            Belum ada tugas untuk pertemuan ini.
          </p>
        ) : (
          tugasPertemuan.map((t: any, idx: number) => {
            const lampiranUrl = buildFileUrl(
              t.lampiran ?? t.pathLampiran ?? t.fileUrl,
            );
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
                    {deskripsiText && (
                      <p className="text-sm text-blue-900 max-w-xl">
                        {deskripsiText}
                      </p>
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

                {/* students submit, not view submissions */}
                <button
                  onClick={() =>
                    navigate(
                      `/mahasiswa/courses/${idCourse}/meeting/${idMeeting}/submission/${t.id}`,
                    )
                  }
                  className="text-sm text-blue-900 hover:underline shrink-0"
                >
                  Lihat Detail
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* PREV / NEXT */}
      <div className="absolute bottom-12 left-0 right-0 z-50 flex justify-between px-12 pointer-events-none ">
        {prevMeeting ? (
          <Button
            onClick={() =>
              navigate(
                `/mahasiswa/courses/${idCourse}/meeting/${prevMeeting.id}`,
              )
            }
            className="shadow pointer-events-auto flex items-center gap-2 text-blue-900 hover:opacity-70 transition"
          >
            <Icon icon="mdi:chevron-left" className="text-xl" />
            <span className="text-sm">Pertemuan {prevMeeting.pertemuan}</span>
          </Button>
        ) : (
          <div />
        )}

        {nextMeeting ? (
          <Button
            onClick={() =>
              navigate(
                `/mahasiswa/courses/${idCourse}/meeting/${nextMeeting.id}`,
              )
            }
            className="pointer-events-auto flex items-center gap-2 text-blue-900 hover:opacity-70 transition shadow"
          >
            <span className="text-sm">Pertemuan {nextMeeting.pertemuan}</span>
            <Icon icon="mdi:chevron-right" className="text-xl" />
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default MhsMeetingDetail;
