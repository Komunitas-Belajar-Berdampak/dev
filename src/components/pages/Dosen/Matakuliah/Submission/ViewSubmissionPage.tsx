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
  const tidakTelat = sudah;
  const telat = 0;

  const pieColors = ["hsl(var(--primary))", "#bfdbfe"];

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
    {
      label: "Mahasiswa",
      icon: "mdi:account-group-outline",
      value: summary?.totalMahasiswa ?? "-",
    },
    {
      label: "Telah Submit",
      icon: "mdi:check-circle-outline",
      value: summary?.telahSubmit ?? "-",
    },
    {
      label: "Butuh Penilaian",
      icon: "mdi:clipboard-edit-outline",
      value: summary?.butuhPenilaian ?? "-",
    },
    {
      label: "Tenggat Waktu Tugas",
      icon: "mdi:clock-outline",
      value: summary?.tenggat ? formatTenggat(summary.tenggat) : "-",
    },
  ];

  return (
    <div className="space-y-8">
      <Title title={judulTugas} items={breadcrumbItems} />

      {/* Judul Card */}
      <div className="rounded-2xl border border-gray-200 bg-white px-8 py-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {judulTugas}
        </h2>
      </div>

      {/* Submission Section */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-primary">Submission</h3>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Icon icon="mdi:loading" className="animate-spin text-3xl text-primary" />
          </div>
        ) : (
          <>
            {/* Pie Charts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm font-semibold text-primary mb-4">
                  Mahasiswa yang sudah mengumpulkan tugas
                </p>
                <ReactApexChart
                  type="pie"
                  series={sudahBelumChart.series}
                  options={sudahBelumChart.options}
                  width={260}
                />
              </div>
              <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm font-semibold text-primary mb-4">
                  Mahasiswa yang telat mengumpulkan tugas
                </p>
                <ReactApexChart
                  type="pie"
                  series={telatChart.series}
                  options={telatChart.options}
                  width={260}
                />
              </div>
            </div>

            {/* Stats Table */}
            <div className="rounded-2xl border-1 border-gray-800 bg-white shadow-[5px_5px_0_0_#000] overflow-hidden">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={[
                    "flex items-center justify-between px-6 py-4",
                    i < stats.length - 1 ? "border-b border-gray-200" : "",
                  ].join(" ")}
                >
                  <span className="flex items-center gap-2 font-semibold text-primary text-sm">
                    <Icon icon={s.icon} className="text-base shrink-0" />
                    {s.label}
                  </span>
                  <span className="text-sm font-bold text-gray-800">{String(s.value)}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() =>
                  navigate(
                    `/dosen/courses/${idCourse}/pertemuan/${assignmentId}/submissions/all`
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
                <Icon icon="mdi:eye-outline" className="text-base" />
                View All Submission
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}