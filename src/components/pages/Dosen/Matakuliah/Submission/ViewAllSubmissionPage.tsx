import { useParams, useNavigate } from "react-router-dom";
import { useSubmissions } from "../hooks/useSubmissions";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";
import Title from "@/components/shared/Title";
import { Icon } from "@iconify/react";

const STORAGE_BASE_URL = import.meta.env.VITE_API_URL
  ? String(import.meta.env.VITE_API_URL).replace(/\/api\/?$/, "")
  : "";

function buildFileUrl(file?: string | null): string | undefined {
  if (!file) return undefined;
  if (/^https?:\/\//.test(file)) return file;
  return `${STORAGE_BASE_URL}/${file.replace(/^\/+/, "")}`;
}

export default function ViewAllSubmissionPage() {
  const { id: idCourse, assignmentId } = useParams<{
    id: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();

  const { data: submissions = [], isLoading } = useSubmissions(assignmentId);
  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);

  const assignment = (assignments as any[]).find((a: any) => a.id === assignmentId);
  const judulTugas = assignment?.judul ?? "Tugas";

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
        <div className="rounded-2xl border-1 border-black bg-white shadow-[5px_5px_0_0_#000] overflow-hidden">
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
              {(submissions as any[]).length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    Belum ada submission.
                  </td>
                </tr>
              ) : (
                (submissions as any[]).map((s: any, i: number) => {
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
                      <td className="px-6 py-4 text-right text-gray-700">
                        {s.grade ?? "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center pt-2">
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
          Edit Nilai
        </button>
      </div>
    </div>
  );
}