import { useParams } from "react-router-dom";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

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

// ─── Chart: Progress Tugas Mahasiswa (Horizontal Bar) ─────────────────────────

function ProgressTugasChart() {
  const categories = dummyProgressTugas.map((d) => d.nama);
  const selesaiData = dummyProgressTugas.map((d) => d.selesai);
  const sisaData = dummyProgressTugas.map((d) => d.total - d.selesai);

  const series = [
    { name: "Selesai", data: selesaiData },
    { name: "Belum", data: sisaData },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "30%",
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    // Menggunakan warna biru/primary
    colors: ["#2563eb", "#e2e8f0"],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      max: 16,
      tickAmount: 2,
      labels: {
        style: { colors: "#6b7280", fontSize: "11px" },
        formatter: (val) => String(val),
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#4b5563", fontSize: "11px" },
        maxWidth: 160,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
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
      <p className="mb-2 text-center text-sm font-semibold text-primary">
        Progress Tugas Mahasiswa
      </p>
      <ReactApexChart type="bar" series={series} options={options} height={450} />
    </div>
  );
}

// ─── Chart: Kontribusi Tugas Mahasiswa Mingguan (Area) ────────────────────────

function KontribusiMingguanChart() {
  const categories = dummyKontribusiMingguan.map((d) => String(d.minggu));

  const series = [
    { name: "Total", data: dummyKontribusiMingguan.map((d) => d.total) },
    { name: "Submitted", data: dummyKontribusiMingguan.map((d) => d.submitted) },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    // Mengganti warna ungu dengan warna biru/primary yang lebih pas
    colors: ["#93c5fd", "#2563eb"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 95],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      title: {
        text: "Minggu",
        style: { color: "#2563eb", fontSize: "11px", fontWeight: "600" },
      },
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: {
        text: "Mahasiswa",
        style: { color: "#2563eb", fontSize: "11px", fontWeight: "600" },
      },
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
    },
    grid: { borderColor: "#f1f5f9" },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#4b5563" },
    },
    tooltip: { shared: true, intersect: false },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">
        Kontribusi Tugas Mahasiswa Mingguan
      </p>
      <ReactApexChart type="area" series={series} options={options} height={300} />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
        <Title
          title="Dashboard Progress Seluruh Pertemuan"
          items={breadcrumbItems}
        />
      </div>

      <ProgressTugasChart />
      <KontribusiMingguanChart />
    </div>
  );
}