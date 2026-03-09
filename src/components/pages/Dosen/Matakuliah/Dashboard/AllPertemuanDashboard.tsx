import { useParams } from "react-router-dom";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useCourseDashboard } from "../hooks/useCourseDashboard";

function getPrimaryColor() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim() || "#2563eb"
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

export default function AllPertemuanDashboard() {
  const { id } = useParams<{ id: string }>();
  const { data: course } = useMatakuliahDetail(id);
  const { data, isLoading, error } = useCourseDashboard(id);

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

  const mahasiswaNames = data.progressTugas.map((d) => d.nama);

  const progressTugasSeries = [
    { name: "Selesai", data: data.progressTugas.map((d) => d.selesai) },
    { name: "Belum", data: data.progressTugas.map((d) => d.total - d.selesai) },
  ];

  const progressTugasOptions: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, barHeight: "30%", borderRadius: 4, borderRadiusApplication: "end", borderRadiusWhenStacked: "last" },
    },
    colors: [primary, "#e2e8f0"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.progressTugas.map((d) => d.nama),
      max: data.progressTugas[0]?.total ?? 16,
      tickAmount: 2,
      labels: { style: { colors: "#6b7280", fontSize: "11px" }, formatter: (val) => String(val) },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { style: { colors: "#4b5563", fontSize: "11px" }, maxWidth: 160 } },
    grid: { borderColor: "#f1f5f9", xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: (_val, { seriesIndex, dataPointIndex }) => {
          const item = data.progressTugas[dataPointIndex];
          if (seriesIndex === 0) return `${item.selesai}/${item.total}`;
          return `${item.total - item.selesai} belum`;
        },
      },
    },
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
    yaxis: { labels: { style: { colors: "#4b5563", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9" },
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
    legend: { show: false },
  };

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

  const scatterSeries = mahasiswaNames.map((nama) => ({
    name: nama,
    data: data.scatter.filter((d) => d.nama === nama).map((d) => ({ x: d.x, y: d.y })),
  }));

  const scatterOptions: ApexOptions = {
    chart: { type: "scatter", toolbar: { show: false }, zoom: { enabled: false } },
    colors: mahasiswaNames.map((_, i) =>
      primary + Math.floor(255 * (1 - i * 0.12)).toString(16).padStart(2, "0")
    ),
    xaxis: {
      title: { text: "Pertemuan ke-", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "11px" }, formatter: (val) => `P${val}` },
      tickAmount: data.totalPertemuan,
      min: 0,
      max: data.totalPertemuan + 1,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Hari Terlambat", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
      min: 0,
    },
    grid: { borderColor: "#f1f5f9" },
    legend: { position: "top", horizontalAlign: "right", labels: { colors: "#4b5563" }, fontSize: "11px" },
    markers: { size: 6, hover: { sizeOffset: 3 } },
    tooltip: {
      x: { formatter: (val) => `Pertemuan ${val}` },
      y: { formatter: (val) => `${val} hari terlambat` },
    },
  };

  const radarSeries = data.progressTugas.slice(0, 3).map((m) => ({
    name: m.nama,
    data: data.heatmap.find((h) => h.nama === m.nama)?.data.map((v) => v * 100) ?? [],
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

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title title="Dashboard Progress Seluruh Pertemuan" items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-center text-sm font-semibold text-primary">Ringkasan Status Tugas Semester</p>
          <ReactApexChart type="donut" series={[data.donut.selesai, data.donut.terlambat, data.donut.belum]} options={donutOptions} height={320} />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-center text-sm font-semibold text-primary">Radar Keaktifan Per Mahasiswa</p>
          <ReactApexChart type="radar" series={radarSeries} options={radarOptions} height={320} />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Progress Tugas Mahasiswa</p>
        <ReactApexChart type="bar" series={progressTugasSeries} options={progressTugasOptions} height={300} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Kontribusi Tugas Mahasiswa Mingguan</p>
        <ReactApexChart type="area" series={kontribusiSeries} options={kontribusiOptions} height={300} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Heatmap Keaktifan Mahasiswa</p>
        <ReactApexChart type="heatmap" series={data.heatmap} options={heatmapOptions} height={280} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Scatter Plot Keterlambatan Submit</p>
        <ReactApexChart type="scatter" series={scatterSeries} options={scatterOptions} height={300} />
      </div>
    </div>
  );
}