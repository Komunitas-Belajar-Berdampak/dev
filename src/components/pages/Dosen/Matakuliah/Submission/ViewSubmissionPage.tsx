import { useParams, useNavigate } from "react-router-dom";
import { useSubmissionSummary } from "../hooks/useSubmissionSummary";
import { useAssignmentsByCourse } from "../hooks/useAssignmentsByCourse";
import Title from "@/components/shared/Title";
import ReactApexChart from "react-apexcharts";
import { Icon } from "@iconify/react";

function formatTenggat(iso: string): string {
  if (!iso) return "-";
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Sudah lewat";
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  const rem = h % 24;
  if (d > 0) return `${d} Hari ${rem} Jam`;
  return `${h} Jam`;
}

export default function ViewSubmissionPage() {
  const { id: idCourse, assignmentId } = useParams<{
    id: string;
    assignmentId: string;
  }>();
  const navigate = useNavigate();

  const { data: summary, isLoading } = useSubmissionSummary(assignmentId);
  const { data: assignments = [] } = useAssignmentsByCourse(idCourse);

  const assignment = (assignments as any[]).find((a: any) => a.id === assignmentId);
  const judulTugas = assignment?.judul ?? summary?.tugasJudul ?? "Tugas";

  const sudah = summary?.telahSubmit ?? 0;
  const belum = (summary?.totalMahasiswa ?? 0) - sudah;
  const tidakTelat = sudah; // dummy — nanti dari BE
  const telat = 0;          // dummy

  const pieColors = ["#1e3a8a", "#93c5fd"];

  const sudahBelumChart = {
    series: belum + sudah === 0 ? [1] : [sudah, belum],
    options: {
      chart: { type: "pie" as const, toolbar: { show: false } },
      labels: belum + sudah === 0 ? ["Tidak ada data"] : ["Sudah", "Belum"],
      colors: belum + sudah === 0 ? ["#e5e7eb"] : pieColors,
      legend: { position: "bottom" as const, fontSize: "12px" },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
      tooltip: { enabled: true },
    },
  };

  const telatChart = {
    series: tidakTelat + telat === 0 ? [1] : [tidakTelat, telat],
    options: {
      chart: { type: "pie" as const, toolbar: { show: false } },
      labels: tidakTelat + telat === 0 ? ["Tidak ada data"] : ["Tidak Telat", "Telat"],
      colors: tidakTelat + telat === 0 ? ["#e5e7eb"] : pieColors,
      legend: { position: "bottom" as const, fontSize: "12px" },
      dataLabels: { enabled: false },
      stroke: { width: 0 },
    },
  };

  const breadcrumbItems = [
    { label: "Courses", href: "/dosen" },
    { label: judulTugas, href: `/dosen/courses/${idCourse}` },
    { label: "View Submission" },
  ];

  const stats = [
    { label: "Mahasiswa", value: summary?.totalMahasiswa ?? "-" },
    { label: "Telah Submit", value: summary?.telahSubmit ?? "-" },
    { label: "Butuh Penilaian", value: summary?.butuhPenilaian ?? "-" },
    {
      label: "Tenggat Waktu Tugas",
      value: summary?.tenggat ? formatTenggat(summary.tenggat) : "-",
    },
  ];

  return (
    <div className="space-y-8">
      <Title title={judulTugas} items={breadcrumbItems} />

      {/* JUDUL CARD */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
          {judulTugas}
        </h2>
      </div>

      {/* SUBMISSION SECTION */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-blue-900">Submission</h3>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Icon icon="mdi:loading" className="animate-spin text-3xl text-blue-900" />
          </div>
        ) : (
          <>
            {/* PIE CHARTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Mahasiswa yang sudah mengumpulkan tugas
                </p>
                <ReactApexChart
                  type="pie"
                  series={sudahBelumChart.series}
                  options={sudahBelumChart.options}
                  width={280}
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Mahasiswa yang telat mengumpulkan tugas
                </p>
                <ReactApexChart
                  type="pie"
                  series={telatChart.series}
                  options={telatChart.options}
                  width={280}
                />
              </div>
            </div>

            {/* STATS TABLE */}
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={[
                    "flex items-center justify-between px-6 py-4",
                    i < stats.length - 1 ? "border-b border-gray-200" : "",
                  ].join(" ")}
                >
                  <span className="font-semibold text-blue-900 text-sm">{s.label}</span>
                  <span className="text-sm text-gray-700">{String(s.value)}</span>
                </div>
              ))}
            </div>

            {/* CTA BUTTON */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() =>
                  navigate(
                    `/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions/all`
                  )
                }
                className="px-6 py-3 rounded-xl bg-blue-900 text-white font-semibold text-sm hover:opacity-90 transition"
              >
                View All Submission
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}