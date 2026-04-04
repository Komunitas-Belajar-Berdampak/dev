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
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getLetterGrade } from "../helpers";

const MhsGradeDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isPending } = useQuery({
    queryKey: ["mhs-grades"],
    queryFn: getMhsGrade,
  });

  const course = data?.data?.courses.find((c) => c.id === id);

  const breadcrumbsItems = [
    { label: "Grades", href: "/mahasiswa/grades" },
    { label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail" },
  ];

  const avg = course?.summary.rataRataNilai ?? 0;
  const letterGrade = getLetterGrade(avg);

  return (
    <section className="flex flex-col gap-6 h-full">
      <Title
        title={
          course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Grade Detail"
        }
        items={breadcrumbsItems}
      />

      {/* Summary */}
      {isPending ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : course ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="bg-white rounded-xl p-4 shadow">
            <p className="text-sm text-gray-500 mb-1">Total assignments</p>
            <p className="text-2xl font-semibold text-primary">
              {course.summary.totalTugas}
            </p>
          </Card>
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Graded</p>
            <p className="text-2xl font-semibold text-green-700">
              {course.summary.totalDinilai}
            </p>
          </Card>
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Pending grade</p>
            <p className="text-2xl font-semibold text-amber-600">
              {course.summary.totalBelumDinilai}
            </p>
          </Card>
          <Card className="bg-white rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">Average score</p>
            <p className="text-2xl font-semibold text-primary">
              {avg > 0 ? avg.toFixed(1) : "—"}
            </p>
          </Card>
        </div>
      ) : null}

      {/* Table */}
      <main className="grow overflow-x-auto">
        {isPending && <Skeleton className="h-[400px] w-full rounded-xl" />}

        {!isPending && !course && <NoData message="Course not found" />}

        {!isPending && course && course.assignments.length === 0 && (
          <NoData message="No assignments found for this course" />
        )}

        {!isPending && course && course.assignments.length > 0 && (
          <Table className="min-w-[600px] text-blue-800">
            <TableHeader>
              <TableRow className="border-b border-black/10">
                <TableHead className="font-bold text-primary">
                  Assignment
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Pertemuan
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Deadline
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Submitted At
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Score
                </TableHead>
                <TableHead className="font-bold text-primary text-center">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.assignments.map((assignment) => {
                const submitted = assignment.submission?.submitted;
                const graded =
                  submitted &&
                  assignment.submission?.nilai !== null &&
                  assignment.submission?.nilai !== undefined;
                const nilai = assignment.submission?.nilai;

                return (
                  <TableRow
                    key={assignment.id}
                    className="h-14 border-b border-black/5"
                  >
                    <TableCell className="font-medium text-primary">
                      {assignment.judul}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      Pertemuan {assignment.pertemuan}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(assignment.tenggat)}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {assignment.submission?.submittedAt
                        ? formatDate(assignment.submission.submittedAt)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {graded ? (
                        <span className="text-primary">{nilai}</span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {graded ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                          Graded
                        </span>
                      ) : submitted ? (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                          Not graded
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                          Not submitted
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}

              {/* Total row */}
              <TableRow className="bg-blue-50 font-medium">
                <TableCell colSpan={4} className="text-primary font-medium">
                  Average score
                </TableCell>
                <TableCell className="text-center text-primary font-semibold">
                  {avg > 0 ? avg.toFixed(1) : 0}
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
                    {letterGrade}
                  </span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </main>
    </section>
  );
};

export default MhsGradeDetail;
