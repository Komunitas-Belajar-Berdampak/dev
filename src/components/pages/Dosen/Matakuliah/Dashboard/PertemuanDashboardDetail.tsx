import { useParams } from "react-router-dom";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const dummyMahasiswaTugas = [
  { nama: "Nathaniel Valentino R", selesai: 0, total: 1 },
  { nama: "Dheandra Halwa G", selesai: 0, total: 1 },
  { nama: "Elmosius Suli", selesai: 1, total: 1 },
  { nama: "Joshua Subianto", selesai: 1, total: 1 },
  { nama: "Benaya Andrias", selesai: 0, total: 1 },
  { nama: "Cherno Salwa", selesai: 1, total: 1 },
  { nama: "Jessica Alvina L", selesai: 1, total: 1 },
];

const dummyTugasPerhari = [
  { tanggal: "01 Jan", total: 45 },
  { tanggal: "02 Jan", total: 52 },
  { tanggal: "03 Jan", total: 38 },
  { tanggal: "04 Jan", total: 45 },
  { tanggal: "05 Jan", total: 19 },
  { tanggal: "06 Jan", total: 23 },
  { tanggal: "07 Jan", total: 2 },
];

// ─── Chart: Mahasiswa Sudah Mengerjakan Tugas (Horizontal Bar) ───────────────

function MahasiswaTugasChart() {
  const categories = dummyMahasiswaTugas.map((d) => d.nama);

  const series = [
    { name: "Selesai", data: dummyMahasiswaTugas.map((d) => d.selesai) },
    { name: "Belum", data: dummyMahasiswaTugas.map((d) => d.total - d.selesai) },
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
      max: 1,
      tickAmount: 1,
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
          const item = dummyMahasiswaTugas[dataPointIndex];
          if (seriesIndex === 0) return `${item.selesai}/${item.total}`;
          return `${item.total - item.selesai} belum`;
        },
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">
        Mahasiswa Sudah Mengerjakan Tugas
      </p>
      <ReactApexChart type="bar" series={series} options={options} height={450} />
    </div>
  );
}

// ─── Chart: Total Mahasiswa Mengerjakan Tugas Perhari (Area) ─────────────────

function TugasPerHariChart() {
  const categories = dummyTugasPerhari.map((d) => d.tanggal);
  const data = dummyTugasPerhari.map((d) => d.total);

  const series = [{ name: "Total Mahasiswa", data }];

  const options: ApexOptions = {
    chart: {
      type: "area",
      // Toolbar dan Zoom dinyalakan sesuai request
      toolbar: { 
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      },
      zoom: { enabled: true },
    },
    // Menggunakan warna primary
    colors: ["#2563eb"], 
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4, // Menambahkan marker agar titik data mudah dihover
      colors: ["#fff"],
      strokeColors: "#2563eb",
      strokeWidth: 2,
      hover: {
        size: 6,
      }
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: "#6b7280", fontSize: "10px" },
        rotate: -30,
        rotateAlways: true,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      min: 0,
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
    },
    grid: { borderColor: "#f1f5f9" },
    legend: { show: false },
    // Tooltip diset supaya lebih responsif saat di-hover
    tooltip: { 
      enabled: true,
      shared: true, 
      intersect: false 
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">
        Total Mahasiswa Mengerjakan Tugas Perhari
      </p>
      <ReactApexChart type="area" series={series} options={options} height={280} />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PertemuanDashboardDetail() {
  const { id, pertemuanId } = useParams<{ id: string; pertemuanId: string }>();
  const { data: course } = useMatakuliahDetail(id);

  const pertemuanNumber = pertemuanId ?? "1";

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: `/dosen/courses/${id}`,
      },
      { label: "View Dashboard", href: `/dosen/courses/${id}/dashboard` },
      {
        label: "View Dashboard Per Pertemuan",
        href: `/dosen/courses/${id}/dashboard/per-pertemuan`,
      },
      { label: `View Dashboard Pertemuan ${pertemuanNumber}` },
    ],
    [course, id, pertemuanNumber]
  );

  return (
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title
          title={`Dashboard Progress Pertemuan ${pertemuanNumber}`}
          items={breadcrumbItems}
        />
      </div>

      <MahasiswaTugasChart />
      <TugasPerHariChart />
    </div>
  );
}