"use client";

import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import Title from "@/components/shared/Title";
import { useMatakuliahDetail } from "../hooks/useMatakuliahDetail";
import { useMeetingDashboard } from "../hooks/useCourseDashboard";

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
        className={`px-3 py-1.5 rounded-md ${
          mode === "top10"
            ? "bg-white shadow text-primary border border-gray-200"
            : "text-gray-500 hover:text-gray-700"
        }`}
      >
        Top 10
      </button>
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1.5 rounded-md ${
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

export default function PertemuanDashboardDetail() {
  const { id, pertemuanId } = useParams<{ id: string; pertemuanId: string }>();
  const { data: course } = useMatakuliahDetail(id);
  const { data, isLoading, error } = useMeetingDashboard(id, pertemuanId);

  const [mahasiswaMode, setMahasiswaMode] = useState<ToggleMode>("top10");

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
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Title title={`Dashboard Progress Pertemuan ${pertemuanNumber}`} items={breadcrumbItems} />
        <p className="text-sm text-red-600">
          {error ? String(error) : "Data tidak tersedia"}
        </p>
      </div>
    );
  }

  // ===== Progress Mahasiswa Logic =====
  const sortedMahasiswa = [...data.mahasiswaTugas].sort(
    (a, b) => b.selesai - a.selesai
  );

  const mahasiswaData =
    mahasiswaMode === "top10"
      ? sortedMahasiswa.slice(0, 10)
      : sortedMahasiswa;

  const BAR_HEIGHT = 36;
  const mahasiswaChartHeight = Math.max(
    260,
    mahasiswaData.length * (BAR_HEIGHT + 10) + 40
  );

  const mahasiswaSeries = [
    { name: "Selesai", data: mahasiswaData.map((d) => d.selesai) },
    { name: "Belum", data: mahasiswaData.map((d) => d.total - d.selesai) },
  ];

  const mahasiswaOptions: ApexOptions = {
    chart: { type: "bar", stacked: true, toolbar: { show: false } },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: `${Math.min(70, Math.max(30, 600 / mahasiswaData.length))}%`,
        borderRadius: 4,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    colors: [primary, "#e2e8f0"],
    dataLabels: {
      enabled: mahasiswaData.length <= 15,
      style: { fontSize: "10px", colors: ["#fff", "#94a3b8"] },
      formatter: (_, { seriesIndex, dataPointIndex }) => {
        if (seriesIndex === 0) {
          const item = mahasiswaData[dataPointIndex];
          return `${item.selesai}/${item.total}`;
        }
        return "";
      },
    },
    xaxis: {
      categories: mahasiswaData.map((d) => d.nama),
      labels: { style: { colors: "#6b7280", fontSize: "11px" } },
    },
    yaxis: {
      labels: {
        style: { colors: "#4b5563", fontSize: "11px" },
        maxWidth: 160,
      },
    },
    grid: { borderColor: "#f1f5f9" },
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: { colors: "#4b5563" },
    },
  };

  const donutOptions: ApexOptions = {
    chart: { type: "donut", toolbar: { show: false } },
    colors: [primary, primary + "88", "#e5e7eb"],
    labels: ["Selesai Tepat Waktu", "Selesai Terlambat", "Belum"],
    legend: { position: "bottom", labels: { colors: "#4b5563" } },
  };

  const timelineSeries = [
    {
      name: "Jumlah Submit",
      data: data.timeline.map((d) => d.jumlah),
    },
  ];

  const timelineOptions: ApexOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    plotOptions: { bar: { borderRadius: 4 } },
    colors: [primary],
    xaxis: {
      categories: data.timeline.map((d) => d.jam),
    },
  };

  return (
    <div className="space-y-6">
      <Title title={`Dashboard Progress Pertemuan ${pertemuanNumber}`} items={breadcrumbItems} />

      {/* GRID 2 KOLOM */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* DONUT */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-2 text-center text-sm font-semibold text-primary">
            Status Tugas Pertemuan Ini
          </p>
          <ReactApexChart
            type="donut"
            series={[data.donut.tepat, data.donut.terlambat, data.donut.belum]}
            options={donutOptions}
            height={300}
          />
        </div>

        {/* PERBANDINGAN */}
        {data.perbandingan && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="mb-2 text-center text-sm font-semibold text-primary">
              Perbandingan dengan Pertemuan Sebelumnya
            </p>
            <ReactApexChart
              type="bar"
              series={[
                { name: "Sebelumnya", data: data.perbandingan.sebelumnya },
                { name: "Sekarang", data: data.perbandingan.sekarang },
              ]}
              options={{
                chart: { toolbar: { show: false } },
                plotOptions: { bar: { borderRadius: 4 } },
                colors: [primary + "55", primary],
                xaxis: { categories: data.perbandingan.labels },
                legend: { position: "top" },
              }}
              height={280}
            />
          </div>
        )}
      </div>

      {/* PROGRESS MAHASISWA */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm font-semibold text-primary">
            Progress Mahasiswa Pertemuan Ini
          </p>

          <div className="flex items-center gap-3">
            {mahasiswaMode === "top10" && (
              <span className="text-xs text-gray-400">
                Diurutkan berdasarkan tugas selesai terbanyak
              </span>
            )}

            <ToggleButton
              mode={mahasiswaMode}
              onChange={setMahasiswaMode}
              totalCount={data.mahasiswaTugas.length}
            />
          </div>
        </div>

        <div
          style={
            mahasiswaMode === "all" && data.mahasiswaTugas.length > 20
              ? { overflowY: "auto", maxHeight: 560 }
              : {}
          }
        >
          <ReactApexChart
            type="bar"
            series={mahasiswaSeries}
            options={mahasiswaOptions}
            height={mahasiswaChartHeight}
          />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <p className="mb-2 text-center text-sm font-semibold text-primary">
          Timeline Jam Submit Tugas
        </p>
        <ReactApexChart
          type="bar"
          series={timelineSeries}
          options={timelineOptions}
          height={280}
        />
      </div>
    </div>
  );
}