import { getMhsGrade } from "@/api/grade";
import NoData from "@/components/shared/NoData";
import Title from "@/components/shared/Title";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getLetterGrade } from "../helpers";

const breadcrumbsItems = [{ label: "Grades", href: "/mahasiswa/grades" }];

const MhsGradePage = () => {
  const navigate = useNavigate();
  const { data, isPending } = useQuery({
    queryKey: ["mhs-grades"],
    queryFn: getMhsGrade,
  });

  const grades = data?.data;

  return (
    <section className="flex flex-col gap-6 h-full">
      <Title title="Grades" items={breadcrumbsItems} />

      {/* Summary */}
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : grades ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Total assignments</p>
            <p className="text-2xl font-semibold text-blue-900">
              {grades.summary.totalTugas}
            </p>
          </Card>
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Graded</p>
            <p className="text-2xl font-semibold text-green-700">
              {grades.summary.totalDinilai}
            </p>
          </Card>
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Pending grade</p>
            <p className="text-2xl font-semibold text-amber-600">
              {grades.summary.totalBelumDinilai}
            </p>
          </Card>
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Overall average</p>
            <p className="text-2xl font-semibold text-blue-900">
              {grades.summary.rataRataNilai > 0
                ? grades.summary.rataRataNilai.toFixed(1)
                : "—"}
            </p>
          </Card>
        </div>
      ) : null}

      {/* Table */}
      <main className="grow overflow-x-auto">
        {isPending && <Skeleton className="h-[400px] w-full rounded-xl" />}

        {!isPending && (!grades || grades.courses.length === 0) && (
          <NoData message="No grade data available" />
        )}

        {!isPending && grades && grades.courses.length > 0 && (
          <Table className="min-w-[640px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-blue-900">
                  Course
                </TableHead>
                <TableHead className="font-bold text-blue-900">Class</TableHead>
                <TableHead className="font-bold text-blue-900">SKS</TableHead>
                <TableHead className="font-bold text-blue-900">
                  Average
                </TableHead>
                <TableHead className="font-bold text-blue-900">
                  Assignments
                </TableHead>
                <TableHead className="font-bold text-blue-900 text-center">
                  Grade
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.courses.map((course) => {
                const allGraded =
                  course.summary.totalDinilai === course.summary.totalTugas &&
                  course.summary.totalTugas > 0;
                const noneGraded = course.summary.totalDinilai === 0;
                const avg = course.summary.rataRataNilai ?? 0;

                return (
                  <TableRow
                    key={course.id}
                    className="h-14 border-b border-black/5 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate(`/mahasiswa/grades/courses/${course.id}`)
                    }
                  >
                    <TableCell>
                      <p className="font-medium text-blue-900">
                        {course.namaMatkul}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.kodeMatkul}
                      </p>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {course.kelas}
                      </span>
                    </TableCell>
                    <TableCell>{course.sks}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-blue-900 rounded-full"
                            style={{ width: `${avg}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {avg.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          allGraded
                            ? "bg-green-100 text-green-800"
                            : noneGraded
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {course.summary.totalDinilai} /{" "}
                        {course.summary.totalTugas} graded
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium ${
                          avg >= 85
                            ? "bg-green-100 text-green-800"
                            : avg >= 70
                              ? "bg-blue-100 text-blue-800"
                              : avg > 0
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {getLetterGrade(avg)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Icon
                        icon="mdi:chevron-right"
                        className="text-gray-400"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </main>
    </section>
  );
};

export default MhsGradePage;
