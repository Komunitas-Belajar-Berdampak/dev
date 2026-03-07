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

const dummyTimelineSubmit = [
  { jam: "06:00", jumlah: 0 },
  { jam: "08:00", jumlah: 1 },
  { jam: "10:00", jumlah: 2 },
  { jam: "12:00", jumlah: 1 },
  { jam: "14:00", jumlah: 3 },
  { jam: "16:00", jumlah: 5 },
  { jam: "18:00", jumlah: 8 },
  { jam: "20:00", jumlah: 12 },
  { jam: "22:00", jumlah: 15 },
  { jam: "23:00", jumlah: 18 },
  { jam: "23:59", jumlah: 4 },
];

const dummyPerbandingan = {
  labels: ["Selesai Tepat Waktu", "Selesai Terlambat", "Belum"],
  sebelumnya: [5, 1, 1],
  sekarang: [4, 0, 3],
};

const dummyDonutPertemuan = { tepat: 4, terlambat: 0, belum: 3 };

function MahasiswaTugasChart() {
  const primary = getPrimaryColor();
  const series = [
    { name: "Selesai", data: dummyMahasiswaTugas.map((d) => d.selesai) },
    { name: "Belum", data: dummyMahasiswaTugas.map((d) => d.total - d.selesai) },
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
      categories: dummyMahasiswaTugas.map((d) => d.nama),
      max: 1,
      tickAmount: 1,
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
          const item = dummyMahasiswaTugas[dataPointIndex];
          if (seriesIndex === 0) return `${item.selesai}/${item.total}`;
          return `${item.total - item.selesai} belum`;
        },
      },
    },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Mahasiswa Sudah Mengerjakan Tugas</p>
      <ReactApexChart type="bar" series={series} options={options} height={300} />
    </div>
  );
}

function TugasPerHariChart() {
  const primary = getPrimaryColor();
  const series = [{ name: "Total Mahasiswa", data: dummyTugasPerhari.map((d) => d.total) }];
  const options: ApexOptions = {
    chart: { type: "area", toolbar: { show: false }, zoom: { enabled: true } },
    colors: [primary],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: primary,
      strokeWidth: 2,
      hover: { size: 6 },
    },
    xaxis: {
      categories: dummyTugasPerhari.map((d) => d.tanggal),
      labels: { style: { colors: "#6b7280", fontSize: "10px" }, rotate: -30, rotateAlways: true },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { min: 0, labels: { style: { colors: "#6b7280", fontSize: "11px" } } },
    grid: { borderColor: "#f1f5f9" },
    legend: { show: false },
    tooltip: { enabled: true, shared: true, intersect: false },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Total Mahasiswa Mengerjakan Tugas Perhari</p>
      <ReactApexChart type="area" series={series} options={options} height={280} />
    </div>
  );
}

function TimelineSubmitChart() {
  const primary = getPrimaryColor();
  const series = [{ name: "Jumlah Submit", data: dummyTimelineSubmit.map((d) => d.jumlah) }];
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: { borderRadius: 4, columnWidth: "55%", borderRadiusApplication: "end" },
    },
    colors: [primary],
    dataLabels: { enabled: false },
    xaxis: {
      categories: dummyTimelineSubmit.map((d) => d.jam),
      title: { text: "Jam Submit", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "10px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: "Mahasiswa", style: { color: primary, fontSize: "11px", fontWeight: "600" } },
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
    },
    grid: { borderColor: "#f1f5f9" },
    tooltip: { y: { formatter: (val) => `${val} mahasiswa` } },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Timeline Jam Submit Tugas</p>
      <ReactApexChart type="bar" series={series} options={options} height={280} />
    </div>
  );
}

function PerbandinganPertemuanChart() {
  const primary = getPrimaryColor();
  const series = [
    { name: "Pertemuan Sebelumnya", data: dummyPerbandingan.sebelumnya },
    { name: "Pertemuan Ini", data: dummyPerbandingan.sekarang },
  ];
  const options: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: false, columnWidth: "40%", borderRadius: 4, borderRadiusApplication: "end" },
    },
    colors: [primary + "55", primary],
    dataLabels: { enabled: false },
    xaxis: {
      categories: dummyPerbandingan.labels,
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
      tickAmount: 5,
    },
    grid: { borderColor: "#f1f5f9" },
    legend: { position: "top", horizontalAlign: "right", labels: { colors: "#4b5563" } },
    tooltip: { y: { formatter: (val) => `${val} mahasiswa` } },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Perbandingan dengan Pertemuan Sebelumnya</p>
      <ReactApexChart type="bar" series={series} options={options} height={280} />
    </div>
  );
}

function DonutStatusPertemuanChart() {
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
              label: "Total",
              color: "#4b5563",
              fontSize: "12px",
              formatter: () =>
                String(dummyDonutPertemuan.tepat + dummyDonutPertemuan.terlambat + dummyDonutPertemuan.belum),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val) => `${val} mahasiswa` } },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <p className="mb-2 text-center text-sm font-semibold text-primary">Status Tugas Pertemuan Ini</p>
      <ReactApexChart
        type="donut"
        series={[dummyDonutPertemuan.tepat, dummyDonutPertemuan.terlambat, dummyDonutPertemuan.belum]}
        options={options}
        height={300}
      />
    </div>
  );
}

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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DonutStatusPertemuanChart />
        <PerbandinganPertemuanChart />
      </div>
      <MahasiswaTugasChart />
      <TugasPerHariChart />
      <TimelineSubmitChart />
    </div>
  );
}