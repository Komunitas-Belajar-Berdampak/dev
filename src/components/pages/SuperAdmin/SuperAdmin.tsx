import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "react-apexcharts";
import Title from "@/components/shared/Title";
// import UserTable from "./UserTable";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const stats = [
  { label: "Total User", value: 1240 },
  { label: "Mahasiswa", value: 980 },
  { label: "Dosen", value: 210 },
  { label: "Admin", value: 50 },
];

const chartOptions: ApexCharts.ApexOptions = {
  chart: {
    type: "bar",
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "45%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Mahasiswa", "Dosen", "Admin"],
  },
  yaxis: {
    labels: {
      formatter: (val) => Math.floor(val).toString(),
    },
  },
  tooltip: {
    y: {
      formatter: (val) => `${val} User`,
    },
  },
};

const chartSeries = [
  {
    name: "Total User",
    data: [980, 210, 50],
  },
];

const SuperAdmin = () => {
  return (
    <div
      className="
        w-full
        max-w-[1400px]
        mx-auto
        px-4 sm:px-6 lg:px-8
        space-y-6 sm:space-y-8
      "
    >
    <div className="space-y-8">
      {/* STAT CARDS */}
      {/* TITLE + BREADCRUMB */}
      <div className="space-y-2 sm:space-y-3">
        {/* TITLE RESPONSIVE */}
        <div className="text-xl sm:text-2xl">
          <Title title="Home" />
        </div>

        {/* BREADCRUMB RESPONSIVE */}
        <Breadcrumb>
          <BreadcrumbList className="flex flex-wrap text-sm">
            <BreadcrumbItem>
              <BreadcrumbPage>Home</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-800">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHART */}
      <Card>
        <CardHeader>
          <CardTitle>User Berdasarkan Role</CardTitle>
        </CardHeader>

        <CardContent>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={320}
          />
        </CardContent>
      </Card>
    </div>
  </div>
  );
};

export default SuperAdmin;
