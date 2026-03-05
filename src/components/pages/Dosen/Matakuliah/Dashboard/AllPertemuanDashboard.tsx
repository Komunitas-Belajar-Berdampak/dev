import { useParams } from "react-router-dom";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";

function getPrimaryColor() {
  return (
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary")
      .trim() || "#2563eb"
  );
}

const mahasiswa = [
  "Nathaniel V",
  "Dheandra H",
  "Elmosius S",
  "Joshua S",
  "Benaya A",
  "Cherno S",
  "Jessica A",
];

const dummyProgressTugas = [
  { nama: "Nathaniel Valentino R", selesai: 4, total: 16 },
  { nama: "Dheandra Halwa G", selesai: 7, total: 16 },
  { nama: "Elmosius Suli", selesai: 9, total: 16 },
  { nama: "Joshua Subianto", selesai: 4, total: 16 },
  { nama: "Benaya Andrias", selesai: 9, total: 16 },
  { nama: "Cherno Salwa", selesai: 11, total: 16 },
  { nama: "Jessica Alvina L", selesai: 7, total: 16 },
];

const dummyKontribusiMingguan = [
  { minggu: 1, submitted: 8, total: 9 },
  { minggu: 2, submitted: 9, total: 10 },
  { minggu: 3, submitted: 9, total: 11 },
  { minggu: 4, submitted: 10, total: 12 },
  { minggu: 5, submitted: 10, total: 15 },
  { minggu: 6, submitted: 9, total: 15 },
  { minggu: 7, submitted: 11, total: 14 },
  { minggu: 8, submitted: 11, total: 13 },
  { minggu: 9, submitted: 10, total: 13 },
  { minggu: 10, submitted: 11, total: 12 },
  { minggu: 11, submitted: 10, total: 12 },
  { minggu: 12, submitted: 11, total: 14 },
  { minggu: 13, submitted: 13, total: 15 },
  { minggu: 14, submitted: 19, total: 20 },
  { minggu: 15, submitted: 16, total: 18 },
  { minggu: 16, submitted: 15, total: 18 },
];

const dummyHeatmap = [
  { name: "Nathaniel V", data: [1,0,1,1,0,1,0,1,1,0,0,1,1,0,1,0] },
  { name: "Dheandra H",  data: [1,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0] },
  { name: "Elmosius S",  data: [1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1] },
  { name: "Joshua S",    data: [0,1,1,0,0,1,1,0,1,0,1,1,0,1,0,1] },
  { name: "Benaya A",    data: [1,1,0,1,1,1,0,1,1,1,0,1,1,0,1,1] },
  { name: "Cherno S",    data: [1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1] },
  { name: "Jessica A",   data: [1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0] },
];

const dummyRadar = [
  { name: "Nathaniel V", data: [50,0,100,100,0,100,0,100,100,0,0,100,100,0,100,0] },
  { name: "Cherno S",    data: [100,100,100,100,0,100,100,100,100,100,100,0,100,100,100,100] },
  { name: "Joshua S",    data: [0,100,100,0,0,100,100,0,100,0,100,100,0,100,0,100] },
];

const dummyDonut = { selesai: 72, terlambat: 18, belum: 38 };

const dummyScatter = [
  { x: 1,  y: 0.2, nama: "Nathaniel V" },
  { x: 2,  y: 1.5, nama: "Dheandra H" },
  { x: 3,  y: 0.1, nama: "Elmosius S" },
  { x: 4,  y: 3.2, nama: "Joshua S" },
  { x: 5,  y: 0.5, nama: "Benaya A" },
  { x: 6,  y: 0.0, nama: "Cherno S" },
  { x: 7,  y: 2.1, nama: "Jessica A" },
  { x: 8,  y: 1.0, nama: "Nathaniel V" },
  { x: 9,  y: 4.5, nama: "Joshua S" },
  { x: 10, y: 0.3, nama: "Elmosius S" },
  { x: 11, y: 1.8, nama: "Dheandra H" },
  { x: 12, y: 0.0, nama: "Cherno S" },
  { x: 13, y: 2.9, nama: "Benaya A" },
  { x: 14, y: 0.7, nama: "Jessica A" },
  { x: 15, y: 5.0, nama: "Joshua S" },
  { x: 16, y: 1.2, nama: "Nathaniel V" },
];

function ProgressTugasChart() {
  const primary = getPrimaryColor();
  const series = [
    { name: "Selesai", data: dummyProgressTugas.map((d) => d.selesai) },
    { name: "Belum", data: dummyProgressTugas.map((d) => d.total - d.selesai) },
  ];
  const options: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "30%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    colors: [primary, "#e2e8f0"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: dummyProgressTugas.map((d) => d.nama),
      max: 16,
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
          const item = dummyProgressTugas[dataPointIndex];
          if (seriesIndex === 0) return `${item.selesai}/${item.total}`;
          return `${item.total - item.selesai} belum`;
        },
      },
    },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Progress Tugas Mahasiswa</p>
      <ReactApexChart type="bar" series={series} options={options} height={300} />
    </div>
  );
}

function KontribusiMingguanChart() {
  const primary = getPrimaryColor();
  const primaryLight = primary + "60";
  const series = [
    { name: "Total", data: dummyKontribusiMingguan.map((d) => d.total) },
    { name: "Submitted", data: dummyKontribusiMingguan.map((d) => d.submitted) },
  ];
  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: false } },
    colors: [primaryLight, primary],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.6, opacityTo: 0.05, stops: [0, 95] },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: dummyKontribusiMingguan.map((d) => String(d.minggu)),
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Kontribusi Tugas Mahasiswa Mingguan</p>
      <ReactApexChart type="area" series={series} options={options} height={300} />
    </div>
  );
}

function HeatmapKeaktifanChart() {
  const primary = getPrimaryColor();
  const options: ApexOptions = {
    chart: { type: "heatmap", toolbar: { show: false } },
    colors: [primary],
    dataLabels: { enabled: false },
    xaxis: {
      categories: dummyKontribusiMingguan.map((d) => `P${d.minggu}`),
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
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Heatmap Keaktifan Mahasiswa</p>
      <ReactApexChart type="heatmap" series={dummyHeatmap} options={options} height={280} />
    </div>
  );
}

function RadarChart() {
  const primary = getPrimaryColor();
  const options: ApexOptions = {
    chart: { type: "radar", toolbar: { show: false } },
    colors: [primary, primary + "99", primary + "55"],
    xaxis: {
      categories: dummyKontribusiMingguan.map((d) => `P${d.minggu}`),
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
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Radar Keaktifan Per Mahasiswa</p>
      <ReactApexChart type="radar" series={dummyRadar} options={options} height={320} />
    </div>
  );
}

function DonutRingkasanChart() {
  const primary = getPrimaryColor();
  const options: ApexOptions = {
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
              formatter: () =>
                String(dummyDonut.selesai + dummyDonut.terlambat + dummyDonut.belum),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val) => `${val} tugas` } },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Ringkasan Status Tugas Semester</p>
      <ReactApexChart
        type="donut"
        series={[dummyDonut.selesai, dummyDonut.terlambat, dummyDonut.belum]}
        options={options}
        height={320}
      />
    </div>
  );
}

function ScatterKeterlambatanChart() {
  const primary = getPrimaryColor();
  const series = mahasiswa.map((nama) => ({
    name: nama,
    data: dummyScatter
      .filter((d) => d.nama === nama)
      .map((d) => ({ x: d.x, y: d.y })),
  }));
  const options: ApexOptions = {
    chart: { type: "scatter", toolbar: { show: false }, zoom: { enabled: false } },
    colors: mahasiswa.map((_, i) =>
      primary + Math.floor(255 * (1 - i * 0.12)).toString(16).padStart(2, "0")
    ),
    xaxis: {
      title: { text: "Pertemuan ke-", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "11px" }, formatter: (val) => `P${val}` },
      tickAmount: 16,
      min: 0,
      max: 17,
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
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Scatter Plot Keterlambatan Submit</p>
      <ReactApexChart type="scatter" series={series} options={options} height={300} />
    </div>
  );
}

export default function AllPertemuanDashboard() {
  const { id } = useParams<{ id: string }>();
  const { data: course } = useMatakuliahDetail(id);

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

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title title="Dashboard Progress Seluruh Pertemuan" items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DonutRingkasanChart />
        <RadarChart />
      </div>
      <ProgressTugasChart />
      <KontribusiMingguanChart />
      <HeatmapKeaktifanChart />
      <ScatterKeterlambatanChart />
    </div>
  );
}