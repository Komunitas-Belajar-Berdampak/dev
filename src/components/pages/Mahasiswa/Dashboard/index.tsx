import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/authStorage";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useMhsDashboard from "./hooks/useMhsDashboard";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

const MhsDashboard = () => {
  const { data, isPending } = useMhsDashboard();
  const navigate = useNavigate();
  const user = getUser();
  const currentDate = dayjs().format("dddd, D MMMM YYYY");

  console.log("usernya", user);

  const stats = [
    {
      label: "Active Classes",
      value: data?.data?.summary.jumlahKelas ?? 0,
    },
    {
      label: "Pending Assignments",
      value: data?.data?.summary.tugasBelumSelesai ?? 0,
    },
    {
      label: "Nearest Deadline",
      value: data?.data?.summary.deadlineTerdekat
        ? dayjs(data.data.summary.deadlineTerdekat).format("MMMM D, YYYY")
        : "N/A",
    },
  ];

  const lastMateri = data?.data?.lastMateri || null;

  console.log(data);
  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
        h-full
        relative
      "
    >
      <section className="flex flex-col gap-2">
        <h1 className="text-lg lg:text-3xl text-primary font-semibold">
          Welcome back, {user?.nama}
        </h1>
        <p className="lg:text-lg">{currentDate}</p>
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6">
        {isPending
          ? Array.from({ length: 3 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          : stats.map((item) => (
              <Card key={item.label}>
                <CardHeader>
                  <CardTitle className="text-muted-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-800">
                    {item.value.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-2 justify-between gap-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">UPCOMING DEADLINES</CardTitle>
          </CardHeader>
          <CardContent className="min-h-48 max-h-48 overflow-auto">
            {data?.data?.tugasDeadlineDekat &&
            data.data.tugasDeadlineDekat.length > 0 ? (
              <div className="flex flex-col gap-2">
                {data?.data.tugasDeadlineDekat.map((tugas, idx) => (
                  <div
                    className="hover:bg-muted rounded-md p-2 cursor-pointer flex flex-col gap-2"
                    key={tugas.id}
                  >
                    <div
                      key={tugas.id}
                      className="flex items-center justify-between"
                      onClick={() =>
                        navigate(
                          `/mahasiswa/courses/${tugas.idCourse}/meeting/${tugas.idMeeting}/submission/${tugas.id}`,
                        )
                      }
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full",
                            tugas.sudahLewat ? "bg-red-500" : "bg-amber-500",
                          )}
                        ></div>
                        <div className="">
                          <h3 className="font-semibold text-primary">
                            {tugas.judul}
                          </h3>
                          <p>
                            {tugas.matkul} • Pertemuan {tugas.pertemuan}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {dayjs(tugas.tenggat).format("MMMM D, YYYY")}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "self-start px-2 py-1 text-sm rounded-full",
                          tugas.sudahLewat
                            ? "text-red-500 bg-red-100"
                            : "text-amber-500 bg-amber-100",
                        )}
                      >
                        {tugas.sudahLewat ? "expired" : "upcoming"}
                      </div>
                    </div>
                    {idx !== data.data.tugasDeadlineDekat.length - 1 && (
                      <hr className="border-t" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic text-center py-10">
                No upcoming deadlines.
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">ACTIVE COURSES</CardTitle>
          </CardHeader>
          <CardContent className="min-h-48 max-h-48 overflow-auto">
            {data?.data?.matakuliahAktif &&
            data.data.matakuliahAktif.length > 0 ? (
              <div className="flex flex-col gap-6">
                {data?.data.matakuliahAktif.map((matkul) => (
                  <div
                    key={matkul.id}
                    className="flex items-center justify-between hover:bg-muted rounded-md p-2 cursor-pointer"
                    onClick={() => navigate(`courses/${matkul.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-4 rounded-md bg-purple-200 text-purple-500">
                        <Icon icon="mdi:book-outline" fontSize={28} />
                      </div>
                      <div className="">
                        <h3 className="font-semibold text-primary">
                          {matkul.namaMatkul}
                        </h3>
                        <p>
                          {matkul.kodeMatkul} • Kelas {matkul.kelas}
                        </p>
                        <div className="w-fit lg:hidden self-start px-2 py-1 text-sm rounded-full bg-gray-200">
                          {matkul.sks} SKS
                        </div>
                      </div>
                    </div>
                    <div className="hidden w-fit lg:block self-start px-2 py-1 text-sm rounded-full bg-gray-200">
                      {matkul.sks} SKS
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic text-center py-10">
                No active courses.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">
              LAST ACCESSED MATERIALS
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data?.data.lastMateri ? (
              <section
                className="flex items-center justify-between hover:bg-muted rounded-md p-4 cursor-pointer group"
                onClick={() =>
                  navigate(
                    `/mahasiswa/courses/${lastMateri?.matkul}/meeting/${lastMateri?.idMeeting}`,
                  )
                }
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-4 rounded-md w-fit",
                      lastMateri?.tipe === "image"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-700",
                    )}
                  >
                    <Icon
                      icon={
                        lastMateri?.tipe === "image"
                          ? "mi:image"
                          : "mdi:file-document-outline"
                      }
                      fontSize={28}
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-primary">
                      {lastMateri?.namaFile}
                    </h3>
                    <p className="text-sm">
                      {lastMateri?.matkul.kodeMatkul} •{" "}
                      {lastMateri?.matkul.namaMatkul}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pertemuan {lastMateri?.pertemuan}
                    </p>
                    <p
                      className={cn(
                        ` rounded-full px-2 mt-1 font-semibold w-fit text-xs`,
                        {
                          "bg-blue-100 text-blue-800":
                            lastMateri?.tipe === "image",
                          "bg-red-100 text-red-700":
                            lastMateri?.tipe !== "image",
                        },
                      )}
                    >
                      {lastMateri?.tipe === "image" ? "Image" : "Document"}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Icon icon="mdi:clock-time-four-outline" fontSize={16} />
                      <p>{dayjs("2026-04-02T12:09:05.380Z").fromNow()}</p>
                    </div>
                  </div>
                </div>
                <div className="p-2 w-fit rounded-full text-primary bg-primary/20 group-hover:bg-primary/50">
                  <Icon icon="mingcute:right-line" fontSize={24} />
                </div>
              </section>
            ) : (
              <div className="text-muted-foreground italic text-center py-10">
                No materials accessed yet.
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MhsDashboard;
