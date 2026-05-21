import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useCourseDashboard } from "../hooks/useCourseDashboard";

function getPrimaryColor() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("color--primary")
      .trim() || "#0d00c2"
  );
}

function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="rounded-2xl border border-gray-200 bg-white p-6 animate-pulse"
      style={{ height: height + 64 }}
    >
      <div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-4" />
      <div className="bg-gray-100 rounded-xl w-full h-full" />
    </div>
  );
}

type ToggleMode = "top10" | "all";

function ToggleButton({
  mode,
  onChange,
  totalCount,
}: {
  mode: ToggleMode;
  onChange: (m: ToggleMode) => void;
  totalCount: number;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 bg-gray-50 text-xs font-medium">
      <button
        onClick={() => onChange("top10")}
        className={`px-3 py-1.5 rounded-md transition-all ${
          mode === "top10"
            ? "bg-white shadow text-primary border border-gray-200"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Top 10
      </button>
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 rounded-md transition-all ${
          mode === "all"
            ? "bg-white shadow text-primary border border-gray-200"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Semua ({totalCount})
      </button>
    </div>
  );
}

export default function AllPertemuanDashboard() {
  const { id } = useParams<{ id: string }>();
  const { data: course } = useMatakuliahDetail(id);
  const { data, isLoading, error } = useCourseDashboard(id);

  const [progressMode, setProgressMode] = useState<ToggleMode>("top10");
  const [heatmapMode, setHeatmapMode] = useState<ToggleMode>("top10");
  const [lateHeatmapMode, setLateHeatmapMode] = useState<ToggleMode>("top10");

  const primary = getPrimaryColor();

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: `/dosen/courses/${id}`,
      },
      { label: "View Dashboard", href: `/dosen/courses/${id}/dashboard` },
      { label: "Dashboard Kontribusi Seluruh Pertemuan" },
    ],
    [course, id]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title title="Dashboard Progress Seluruh Pertemuan" items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeleton height={320} />
          <ChartSkeleton height={320} />
        </div>
        <ChartSkeleton height={300} />
        <ChartSkeleton height={300} />
        <ChartSkeleton height={280} />
        <ChartSkeleton height={300} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Title title="Dashboard Progress Seluruh Pertemuan" items={breadcrumbItems} />
        <p className="text-sm text-red-600">{error ? String(error) : "Data tidak tersedia"}</p>
      </div>
    );
  }

  const totalMahasiswa = data.progressTugas.length;

  // ─── Sorted data: top 10 by "selesai" descending ───
  const sortedProgress = [...data.progressTugas].sort((a, b) => b.selesai - a.selesai);
  const progressData = progressMode === "top10" ? sortedProgress.slice(0, 10) : sortedProgress;

  // ─── Progress Tugas Chart ───
  // Dynamic height: 40px per bar minimum, 28px minimum gap
  const BAR_HEIGHT = 36;
  const progressChartHeight = Math.max(260, progressData.length * (BAR_HEIGHT + 10) + 40);

  const progressTugasSeries = [
    { name: "Selesai", data: progressData.map((d) => d.selesai) },
    { name: "Belum", data: progressData.map((d) => d.total - d.selesai) },
  ];

  const progressTugasOptions: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: `${Math.min(70, Math.max(30, 600 / progressData.length))}%`,
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    colors: [primary, "#e2e8f0"],
    dataLabels: {
      enabled: progressData.length <= 15,
      style: { fontSize: "10px", colors: ["#fff", "#94a3b8"] },
      formatter: (_, { seriesIndex, dataPointIndex }) => {
        if (seriesIndex === 0) {
          const item = progressData[dataPointIndex];
          return `${item.selesai}/${item.total}`;
        }
        return "";
      },
    },
    xaxis: {
      categories: progressData.map((d) => d.nama),
      max: data.progressTugas[0]?.total ?? 16,
      tickAmount: 4,
      labels: { style: { colors: "#6b7280", fontSize: "11px" }, formatter: (val) => String(val) },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#4b5563", fontSize: "11px" },
        maxWidth: 160,
        // Truncate long labels
        formatter: (val: number) => {
          const label = String(val);
          return label.length > 20 ? label.slice(0, 18) + "…" : label;
        },
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#4b5563" },
      fontSize: "11px",
    },
    tooltip: {
      y: {
        formatter: (_val, { seriesIndex, dataPointIndex }) => {
          const item = progressData[dataPointIndex];
          if (seriesIndex === 0) return `${item.selesai}/${item.total} selesai`;
          return `${item.total - item.selesai} belum`;
        },
      },
    },
  };

  // ─── Heatmap Chart ───
  const sortedHeatmap = [...data.heatmap].sort((a, b) => {
    const sumA = a.data.reduce((s: number, v: number) => s + v, 0);
    const sumB = b.data.reduce((s: number, v: number) => s + v, 0);
    return sumB - sumA;
  });
  const heatmapData = heatmapMode === "top10" ? sortedHeatmap.slice(0, 10) : sortedHeatmap;
  const heatmapChartHeight = Math.max(220, heatmapData.length * 32 + 50);

  const heatmapOptions: ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    colors: [primary],
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.kontribusiMingguan.map((d) => `P${d.minggu}`),
      labels: { style: { colors: "#6b7280", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#4b5563", fontSize: "11px" },
        maxWidth: 160,
        formatter: (val: number) => {
          const label = String(val);
          return label.length > 18 ? label.slice(0, 16) + "…" : label;
        },
      },
    },
    grid: { borderColor: "#f1f5f9", padding: { left: 8, right: 8 } },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.7,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#e2e8f0", name: "Belum" },
            { from: 1, to: 1, color: primary, name: "Selesai" },
          ],
        },
      },
    },
    tooltip: { y: { formatter: (val) => (val === 1 ? "Selesai" : "Belum") } },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#4b5563" },
      fontSize: "11px",
    },
  };

  // ─── Heatmap Keterlambatan ───
  // Build series: each mahasiswa = 1 series, data = hari terlambat per pertemuan
  // data.scatter: { nama, x (pertemuan), y (hari terlambat) }
  const allMahasiswaNames = [...new Set(data.scatter.map((d: { nama: string }) => d.nama))];

  // Sort by total hari terlambat descending
  const sortedLate = [...allMahasiswaNames].sort((a, b) => {
    const sumA = data.scatter.filter((d: { nama: string; y: number }) => d.nama === a).reduce((s: number, d: { y: number }) => s + d.y, 0);
    const sumB = data.scatter.filter((d: { nama: string; y: number }) => d.nama === b).reduce((s: number, d: { y: number }) => s + d.y, 0);
    return sumB - sumA;
  });

  const lateNames = lateHeatmapMode === "top10" ? sortedLate.slice(0, 10) : sortedLate;
  const lateHeatmapChartHeight = Math.max(220, lateNames.length * 32 + 50);

  // Build series: name = mahasiswa, data = array of hari terlambat per pertemuan (0 if not late)
  const pertemuanList = Array.from({ length: data.totalPertemuan }, (_, i) => i + 1);
  const lateHeatmapSeries = lateNames.map((nama) => ({
    name: (nama as string).length > 18 ? (nama as string).slice(0, 16) + "…" : nama as string,
    data: pertemuanList.map((p) => {
      const entry = data.scatter.find((d: { nama: string; x: number }) => d.nama === nama && d.x === p);
      return entry ? entry.y : 0;
    }),
  }));

  // Find max late days for color scale
  const maxLateDays = Math.max(
    1,
    ...data.scatter.map((d: { y: number }) => d.y)
  );

  const lateHeatmapOptions: ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    colors: ["#f97316"], // orange for "late" — distinct from primary blue of keaktifan heatmap
    dataLabels: {
      enabled: lateNames.length <= 15 && pertemuanList.length <= 16,
      style: { fontSize: "9px", colors: ["#fff"] },
      formatter: (val) => (Number(val) > 0 ? String(val) : ""),
    },
    xaxis: {
      categories: pertemuanList.map((p) => `P${p}`),
      labels: { style: { colors: "#6b7280", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
      title: { text: "Pertemuan", style: { color: "#6b7280", fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#4b5563", fontSize: "11px" },
        maxWidth: 160,
        formatter: (val: number) => {
          const label = String(val);
          return label.length > 18 ? `${label.slice(0, 16)}…` : label;
        },
      },
    },
    grid: { borderColor: "#f1f5f9", padding: { left: 8, right: 8 } },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.8,
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: "#e2e8f0", name: "Tepat Waktu" },
            { from: 1, to: Math.ceil(maxLateDays * 0.33), color: "#fed7aa", name: "Terlambat Ringan" },
            { from: Math.ceil(maxLateDays * 0.33) + 1, to: Math.ceil(maxLateDays * 0.66), color: "#f97316", name: "Terlambat Sedang" },
            { from: Math.ceil(maxLateDays * 0.66) + 1, to: maxLateDays + 99, color: "#b91c1c", name: "Terlambat Parah" },
          ],
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) =>
          val === 0 ? "Tepat waktu" : `${val} hari terlambat`,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#4b5563" },
      fontSize: "11px",
    },
  };

  // ─── Radar & Donut (unchanged logic, just uses top 3 sorted) ───
  const donutOptions: ApexOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    colors: [primary, primary + "88", "#e2e8f0"],
    labels: ["Selesai Tepat Waktu", "Selesai Terlambat", "Belum"],
    dataLabels: { enabled: true, style: { fontSize: "11px" } },
    legend: { position: "bottom", labels: { colors: "#4b5563" } },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Tugas",
              color: "#4b5563",
              fontSize: "12px",
              formatter: () => String(data.donut.selesai + data.donut.terlambat + data.donut.belum),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val) => `${val} tugas` } },
  };

  const top3 = [...data.progressTugas].sort((a, b) => b.selesai - a.selesai).slice(0, 3);
  const radarSeries = top3.map((m) => ({
    name: m.nama.length > 16 ? m.nama.slice(0, 14) + "…" : m.nama,
    data: data.heatmap.find((h) => h.nama === m.nama)?.data.map((v: number) => v * 100) ?? [],
  }));

  const radarOptions: ApexOptions = {
    chart: { type: "radar", toolbar: { show: false } },
    colors: [primary, primary + "99", primary + "55"],
    xaxis: {
      categories: data.kontribusiMingguan.map((d) => `P${d.minggu}`),
      labels: { style: { colors: "#6b7280", fontSize: "10px" } },
    },
    yaxis: { show: false },
    stroke: { width: 2 },
    fill: { opacity: 0.15 },
    markers: { size: 3 },
    legend: { position: "top", labels: { colors: "#4b5563" } },
    grid: { borderColor: "#f1f5f9" },
    tooltip: { y: { formatter: (val) => `${val}%` } },
  };

  const kontribusiSeries = [
    { name: "Total", data: data.kontribusiMingguan.map((d) => d.total) },
    { name: "Submitted", data: data.kontribusiMingguan.map((d) => d.submitted) },
  ];

  const kontribusiOptions: ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    colors: [primary + "60", primary],
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 95] } },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.kontribusiMingguan.map((d) => String(d.minggu)),
      title: { text: "Minggu", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Mahasiswa", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
    },
    grid: { borderColor: "#f1f5f9" },
    legend: { position: "top", horizontalAlign: "right", labels: { colors: "#4b5563" } },
    tooltip: { shared: true, intersect: false },
  };

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title title="Dashboard Progress Seluruh Pertemuan" items={breadcrumbItems} />
      </div>

      {/* Donut + Radar: unchanged */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-center text-sm font-semibold text-primary">Ringkasan Status Tugas Semester</p>
          <ReactApexChart
            type="donut"
            series={[data.donut.selesai, data.donut.terlambat, data.donut.belum]}
            options={donutOptions}
            height={320}
          />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-center text-sm font-semibold text-primary">Radar Keaktifan Per Mahasiswa</p>
          <ReactApexChart type="radar" series={radarSeries} options={radarOptions} height={320} />
        </div>
      </div>

      {/* Progress Tugas — with toggle */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-primary">Progress Tugas Mahasiswa</p>
          <div className="flex items-center gap-3">
            {progressMode === "top10" && (
              <span className="text-xs text-gray-400">Diurutkan berdasarkan tugas selesai terbanyak</span>
            )}
            <ToggleButton mode={progressMode} onChange={setProgressMode} totalCount={totalMahasiswa} />
          </div>
        </div>
        {/* Scrollable wrapper when "all" and many students */}
        <div
          style={
            progressMode === "all" && totalMahasiswa > 20
              ? { overflowY: "auto", maxHeight: 560 }
              : {}
          }
        >
          <ReactApexChart
            type="bar"
            series={progressTugasSeries}
            options={progressTugasOptions}
            height={progressChartHeight}
          />
        </div>
      </div>

      {/* Kontribusi Mingguan — unchanged */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Kontribusi Tugas Mahasiswa Mingguan</p>
        <ReactApexChart type="area" series={kontribusiSeries} options={kontribusiOptions} height={300} />
      </div>

      {/* Heatmap — with toggle */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-semibold text-primary">Heatmap Keaktifan Mahasiswa</p>
          <div className="flex items-center gap-3">
            {heatmapMode === "top10" && (
              <span className="text-xs text-gray-400">Top 10 mahasiswa paling aktif</span>
            )}
            <ToggleButton mode={heatmapMode} onChange={setHeatmapMode} totalCount={totalMahasiswa} />
          </div>
        </div>
        {/* Scrollable on "all" */}
        <div
          style={
            heatmapMode === "all" && heatmapData.length > 15
              ? { overflowY: "auto", maxHeight: 540 }
              : {}
          }
        >
          <ReactApexChart
            type="heatmap"
            series={heatmapData}
            options={heatmapOptions}
            height={heatmapChartHeight}
          />
        </div>
      </div>

      {/* Heatmap Keterlambatan — replaces scatter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-primary">Heatmap Keterlambatan Submit</p>
            <p className="text-xs text-gray-400 mt-0.5">Warna menunjukkan jumlah hari terlambat per pertemuan</p>
          </div>
          <div className="flex items-center gap-3">
            {lateHeatmapMode === "top10" && (
              <span className="text-xs text-gray-400">Top 10 mahasiswa paling sering terlambat</span>
            )}
            <ToggleButton mode={lateHeatmapMode} onChange={setLateHeatmapMode} totalCount={totalMahasiswa} />
          </div>
        </div>
        <div
          style={
            lateHeatmapMode === "all" && lateNames.length > 15
              ? { overflowY: "auto", maxHeight: 540 }
              : {}
          }
        >
          <ReactApexChart
            type="heatmap"
            series={lateHeatmapSeries}
            options={lateHeatmapOptions}
            height={lateHeatmapChartHeight}
          />
        </div>
      </div>
    </div>
  );
}