import { useParams } from "react-router-dom";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingDashboard } from "../hooks/useCourseDashboard";

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

export default function PertemuanDashboardDetail() {
  const { id, pertemuanId } = useParams<{ id: string; pertemuanId: string }>();
  const { data: course } = useMatakuliahDetail(id);
  const { data, isLoading, error } = useMeetingDashboard(id, pertemuanId);

  const primary = getPrimaryColor();
  const pertemuanNumber = pertemuanId ?? "1";

  const breadcrumbItems = useMemo(
    () => [
      { label: "Courses", href: "/dosen" },
      {
        label: course ? `${course.kodeMatkul} ${course.namaMatkul}` : "Detail",
        href: `/dosen/courses/${id}`,
      },
      { label: "View Dashboard", href: `/dosen/courses/${id}/dashboard` },
      { label: "View Dashboard Per Pertemuan", href: `/dosen/courses/${id}/dashboard/per-pertemuan` },
      { label: `View Dashboard Pertemuan ${pertemuanNumber}` },
    ],
    [course, id, pertemuanNumber]
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Title title={`Dashboard Progress Pertemuan ${pertemuanNumber}`} items={breadcrumbItems} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeleton height={300} />
          <ChartSkeleton height={280} />
        </div>
        <ChartSkeleton height={300} />
        <ChartSkeleton height={280} />
        <ChartSkeleton height={280} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Title title={`Dashboard Progress Pertemuan ${pertemuanNumber}`} items={breadcrumbItems} />
        <p className="text-sm text-red-600">{error ? String(error) : "Data tidak tersedia"}</p>
      </div>
    );
  }

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
              label: "Total",
              color: "#4b5563",
              fontSize: "12px",
              formatter: () => String(data.donut.tepat + data.donut.terlambat + data.donut.belum),
            },
          },
        },
      },
    },
    tooltip: { y: { formatter: (val) => `${val} mahasiswa` } },
  };

  const mahasiswaSeries = [
    { name: "Selesai", data: data.mahasiswaTugas.map((d) => d.selesai) },
    { name: "Belum", data: data.mahasiswaTugas.map((d) => d.total - d.selesai) },
  ];

  const mahasiswaOptions: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: {
      bar: { horizontal: true, barHeight: "30%", borderRadius: 4, borderRadiusApplication: "end", borderRadiusWhenStacked: "last" },
    },
    colors: [primary, "#e2e8f0"],
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.mahasiswaTugas.map((d) => d.nama),
      max: data.mahasiswaTugas[0]?.total ?? 1,
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
          const item = data.mahasiswaTugas[dataPointIndex];
          if (seriesIndex === 0) return `${item.selesai}/${item.total}`;
          return `${item.total - item.selesai} belum`;
        },
      },
    },
  };

  const timelineSeries = [{ name: "Jumlah Submit", data: data.timeline.map((d) => d.jumlah) }];

  const timelineOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%", borderRadiusApplication: "end" } },
    colors: [primary],
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.timeline.map((d) => d.jam),
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
    <div className="space-y-6">
      <div className="text-xl sm:text-2xl">
        <Title title={`Dashboard Progress Pertemuan ${pertemuanNumber}`} items={breadcrumbItems} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-center text-sm font-semibold text-primary">Status Tugas Pertemuan Ini</p>
          <ReactApexChart type="donut" series={[data.donut.tepat, data.donut.terlambat, data.donut.belum]} options={donutOptions} height={300} />
        </div>

        {data.perbandingan && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="mb-2 text-center text-sm font-semibold text-primary">Perbandingan dengan Pertemuan Sebelumnya</p>
            <ReactApexChart
              type="bar"
              series={[
                { name: "Pertemuan Sebelumnya", data: data.perbandingan.sebelumnya },
                { name: "Pertemuan Ini", data: data.perbandingan.sekarang },
              ]}
              options={{
                chart: { type: "bar", toolbar: { show: false } },
                plotOptions: { bar: { horizontal: false, columnWidth: "40%", borderRadius: 4, borderRadiusApplication: "end" } },
                colors: [primary + "55", primary],
                dataLabels: { enabled: false },
                xaxis: {
                  categories: data.perbandingan.labels,
                  labels: { style: { colors: "#6b7280", fontSize: "11px" } },
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                },
                yaxis: { labels: { style: { colors: "#6b7280", fontSize: "11px" } }, tickAmount: 5 },
                grid: { borderColor: "#f1f5f9" },
                legend: { position: "top", horizontalAlign: "right", labels: { colors: "#4b5563" } },
                tooltip: { y: { formatter: (val) => `${val} mahasiswa` } },
              }}
              height={280}
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Mahasiswa Sudah Mengerjakan Tugas</p>
        <ReactApexChart type="bar" series={mahasiswaSeries} options={mahasiswaOptions} height={300} />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">Timeline Jam Submit Tugas</p>
        <ReactApexChart type="bar" series={timelineSeries} options={timelineOptions} height={280} />
      </div>
    </div>
  );
}