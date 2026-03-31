import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/authStorage";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useMhsDashboard from "./hooks/useMhsDashboard";

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
        <h1 className="text-3xl text-primary font-semibold">
          Welcome back, {user?.nama}
        </h1>
        <p className="text-lg">{currentDate}</p>
      </section>
      <section className="grid grid-cols-3 items-center gap-6">
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
      <section className="grid grid-cols-2 justify-between gap-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">UPCOMING DEADLINES</CardTitle>
          </CardHeader>
          <CardContent className="max-h-48 overflow-auto">
            {data?.data?.tugasDeadlineDekat &&
            data.data.tugasDeadlineDekat.length > 0 ? (
              <div className="flex flex-col gap-6">
                {data?.data.tugasDeadlineDekat.map((tugas) => (
                  <div
                    key={tugas.id}
                    className="flex items-center justify-between hover:bg-muted rounded-md p-2"
                    onClick={() =>
                      navigate(`mahasiswa/courses/699deac86d0b54ffd9f3ec63`)
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
          <CardContent className="max-h-48 overflow-auto">
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
                      </div>
                    </div>
                    <div className="self-start px-2 py-1 text-sm rounded-full bg-gray-200">
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
              <div className="max-h-48 overflow-auto">ada card nya</div>
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
