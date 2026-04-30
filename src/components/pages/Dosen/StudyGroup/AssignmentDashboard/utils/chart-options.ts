import type { ApexOptions } from 'apexcharts';
import { PRIMARY_CHART_COLOR, SECONDARY_CHART_COLOR } from './constants';
import { formatScore } from './formatters';
import type { StudentContributionRow } from './types';

export const getHeatmapOptions = (): ApexOptions => ({
  chart: { type: 'heatmap', toolbar: { show: false } },
  dataLabels: { enabled: false },
  colors: [PRIMARY_CHART_COLOR],
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.75,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: SECONDARY_CHART_COLOR, name: '0 points' },
          { from: 1, to: 20, color: '#c7d2fe', name: 'Rendah' },
          { from: 21, to: 50, color: '#818cf8', name: 'Sedang' },
          { from: 51, to: 100, color: PRIMARY_CHART_COLOR, name: 'Tinggi' },
        ],
      },
    },
  },
  xaxis: {
    labels: { style: { colors: '#6b7280', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: '#4b5563', fontSize: '11px' }, maxWidth: 170 } },
  grid: { borderColor: '#f1f5f9' },
  tooltip: { y: { formatter: (value) => `${value} points` } },
  legend: { labels: { colors: '#4b5563' } },
});

export const getTopContributorOptions = (rows: StudentContributionRow[], isWeightEnabled: boolean): ApexOptions => ({
  chart: { type: 'bar', toolbar: { show: false } },
  colors: [PRIMARY_CHART_COLOR],
  plotOptions: { bar: { horizontal: true, borderRadius: 5, barHeight: '42%' } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: rows.map((row) => row.nama),
    labels: { style: { colors: '#6b7280', fontSize: '11px' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { colors: '#4b5563', fontSize: '11px' }, maxWidth: 160 } },
  grid: { borderColor: '#f1f5f9', xaxis: { lines: { show: true } }, yaxis: { lines: { show: false } } },
  tooltip: { y: { formatter: (value) => (isWeightEnabled ? `${formatScore(Number(value))} score` : `${value} points`) } },
});
