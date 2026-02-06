export type DateTimeFormatOptions = {
  dateLocale?: string;
  timeLocale?: string;
  hour12?: boolean;
};

const DEFAULT_OPTIONS: Required<DateTimeFormatOptions> = {
  dateLocale: 'en-GB',
  timeLocale: 'en-US',
  hour12: true,
};

export function formatDateTime(isoLike: string, options: DateTimeFormatOptions = {}): string {
  const { dateLocale, timeLocale, hour12 } = { ...DEFAULT_OPTIONS, ...options };

  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return isoLike;

  const datePart = new Intl.DateTimeFormat(dateLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat(timeLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
  }).format(date);

  return `${datePart} ${timePart}`;
}
