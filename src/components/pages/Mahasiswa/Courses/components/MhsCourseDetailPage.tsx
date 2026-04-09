import MatkulDesc from "@/components/pages/Dosen/Matakuliah/Detail/components/MatkulDesc";
import { useMeetingsByCourse } from "@/components/pages/Dosen/Matakuliah/hooks/useMeetingsByCourse";
import Title from "@/components/shared/Title";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDetailCourses, type CourseMember } from "../hooks/useDetailCourses";
import MhsMeetingList from "./MhsMeetingList";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={["animate-pulse rounded-md bg-gray-200/80", className].join(
        " ",
      )}
    />
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 w-full">
          <SkeletonBlock className="h-7 w-[320px] sm:w-[420px]" />
          <SkeletonBlock className="h-4 w-[220px] sm:w-[280px]" />
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-3">
        <SkeletonBlock className="h-4 w-[200px]" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-[92%]" />
        <SkeletonBlock className="h-4 w-[86%]" />
        <SkeletonBlock className="h-4 w-[72%]" />
      </div>
      <div className="space-y-3">
        <div className="grid gap-3">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="rounded-xl border border-gray-200 bg-white p-4 space-y-2"
            >
              <div className="flex items-center justify-between gap-3">
                <SkeletonBlock className="h-4 w-[180px]" />
                <SkeletonBlock className="h-6 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-3 w-[88%]" />
              <SkeletonBlock className="h-3 w-[76%]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MhsCourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();

  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
    refetch: refetchCourse,
  } = useDetailCourses(id);
  const {
    data: meetings,
    isLoading: meetingsLoading,
    error: meetingsError,
    refetch: refetchMeetings,
  } = useMeetingsByCourse(id);

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/mahasiswa/courses" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
      },
    ],
    [course],
  );

  if (courseLoading) return <CourseDetailSkeleton />;

  if (courseError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
        <p className="text-sm text-red-600">{courseError}</p>
        <button
          onClick={() => void refetchCourse()}
          className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:opacity-90 transition text-sm"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <p className="text-center text-sm text-gray-500">
        Mata kuliah tidak ditemukan
      </p>
    );
  }

  const members: CourseMember[] = [
    ...course.pengajarList,
    ...course.mahasiswaList,
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="text-xl sm:text-2xl">
          <Title
            title={`${course.kodeMatkul} – ${course.namaMatkul}`}
            items={breadcrumbItems}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="shrink-0 gap-2">
              <Users className="size-4" />
              <span className="hidden sm:inline">Participants</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Participants</DialogTitle>
            </DialogHeader>

            <div className="overflow-y-auto -mx-6 px-6 space-y-4">
              {course.pengajarList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Lecturers
                  </p>
                  <ul className="space-y-1">
                    {course.pengajarList.map((member) => (
                      <li key={member.id}>
                        <Link
                          to={`/profile/${member.nrp}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {member.nama}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.nrp}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {course.mahasiswaList.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Students
                  </p>
                  <ul className="space-y-1">
                    {course.mahasiswaList.map((member) => (
                      <li key={member.id}>
                        <Link
                          to={`/profile/${member.nrp}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-accent transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {member.nama}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {member.nrp}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {members.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No members in this class yet.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <MatkulDesc
        description={course.deskripsi}
        kodeMatkul={course.kodeMatkul}
        namaMatkul={course.namaMatkul}
      />

      <div className="space-y-3">
        {meetingsLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
            Loading pertemuan...
          </div>
        )}

        {!meetingsLoading && meetingsError && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
            <p className="text-sm text-red-600">{meetingsError}</p>
            <button
              onClick={() => void refetchMeetings()}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:opacity-90 transition text-sm"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!meetingsLoading && !meetingsError && (
          <MhsMeetingList pertemuan={meetings} />
        )}
      </div>
    </div>
  );
};

export default MhsCourseDetailPage;
