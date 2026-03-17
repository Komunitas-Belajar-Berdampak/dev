import { KONTRIBUSI_ALL_THREAD_VALUE, KONTRIBUSI_EMPTY_MOST_ACTIVE_DAY, KONTRIBUSI_TREND_BAR_COLOR } from '@/components/pages/Dosen/StudyGroup/TopikDetail/constant';
import type { StudyGroupMemberDetail } from '@/types/sg';
import type { ApexOptions } from 'apexcharts';

type AktivitasItem = StudyGroupMemberDetail['aktivitas'][number];

export const formatDateOnly = (value: number | string | Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));

export const formatTimeOnly = (value: number | string | Date) =>
  new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));

export const toDateKey = (value: string) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const getThreadOptions = (data: StudyGroupMemberDetail) => [{ label: 'Semua', value: KONTRIBUSI_ALL_THREAD_VALUE }, ...(data?.kontribusiTotalByThread ?? []).map((t) => ({ label: t.thread, value: t.thread }))];

export const getFilteredAktivitas = ({ aktivitas, field, keyword, fromDate, toDate }: { aktivitas: AktivitasItem[]; field: string; keyword: string; fromDate: string; toDate: string }) => {
  const fromDateObj = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
  const toDateObj = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

  return aktivitas
    .filter((a) => {
      if (field !== KONTRIBUSI_ALL_THREAD_VALUE && a.thread !== field) return false;
      if (keyword) {
        const kw = keyword.toLowerCase();
        const hay = `${a.thread} ${a.aktivitas}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }

      const ts = new Date(a.timestamp);
      if (fromDateObj && ts < fromDateObj) return false;
      if (toDateObj && ts > toDateObj) return false;
      return true;
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const groupAktivitasByDate = (aktivitas: AktivitasItem[]) => {
  const map = new Map<number, AktivitasItem[]>();

  aktivitas.forEach((item) => {
    const dateKey = toDateKey(item.timestamp);
    const current = map.get(dateKey) ?? [];
    current.push(item);
    map.set(dateKey, current);
  });

  return [...map.entries()].sort((a, b) => b[0] - a[0]);
};

export const buildDailyTrend = (aktivitas: AktivitasItem[]) => {
  const map = new Map<number, number>();

  aktivitas.forEach((item) => {
    const d = new Date(item.timestamp);
    d.setHours(0, 0, 0, 0);

    const bucketKey = d.getTime();
    map.set(bucketKey, (map.get(bucketKey) ?? 0) + item.kontribusi);
  });

  return [...map.entries()].sort(([a], [b]) => a - b).map(([time, points]) => ({ time, points }));
};

export const getMostActiveDay = (dailyTrend: { time: number; points: number }[]) => {
  if (dailyTrend.length === 0) return KONTRIBUSI_EMPTY_MOST_ACTIVE_DAY;

  const top = dailyTrend.reduce((acc, curr) => (curr.points > acc.points ? curr : acc));
  return formatDateOnly(top.time);
};

export const buildTrendSeries = (dailyTrend: { time: number; points: number }[]) => [
  {
    name: 'Kontribusi',
    data: dailyTrend.map((d) => ({ x: d.time, y: d.points })),
  },
];

export const getTrendOptions = (): ApexOptions => ({
  chart: {
    type: 'bar',
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '45%',
    },
  },
  colors: [KONTRIBUSI_TREND_BAR_COLOR],
  dataLabels: { enabled: false },
  xaxis: {
    type: 'datetime',
    labels: {
      rotate: -35,
      datetimeUTC: false,
      format: 'dd/MM/yy',
    },
  },
  yaxis: {
    title: {
      text: 'Points',
    },
    min: 0,
    forceNiceScale: true,
  },
  tooltip: {
    x: {
      formatter: (value) => formatDateOnly(Number(value)),
    },
  },
  grid: {
    borderColor: '#e5e7eb',
    strokeDashArray: 4,
  },
  legend: {
    show: false,
  },
});
