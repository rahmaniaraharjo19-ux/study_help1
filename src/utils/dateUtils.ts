import { DayOfWeek } from '../types/study';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export function toLocalIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function addDaysIso(baseDate: Date, offsetDays: number): string {
  const copy = new Date(baseDate);
  copy.setDate(copy.getDate() + offsetDays);
  return toLocalIsoDate(copy);
}

export function getTodayDayOfWeek(date: Date = new Date()): DayOfWeek {
  const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday ... 6 = Saturday
  switch (jsDay) {
    case 1:
      return 'Senin';
    case 2:
      return 'Selasa';
    case 3:
      return 'Rabu';
    case 4:
      return 'Kamis';
    case 5:
      return 'Jumat';
    default:
      return 'Senin'; // Weekend defaults to Monday preview
  }
}

export function isWeekend(date: Date = new Date()): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function formatIndonesianDate(isoDate: string): string {
  if (!isoDate) return '-';
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dateObj = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(dateObj);
}

export function formatFullTodayIndonesian(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export interface DeadlineMeta {
  label: string;
  urgency: 'overdue' | 'today' | 'tomorrow' | 'soon' | 'upcoming' | 'done';
  daysDiff: number;
}

export function getDeadlineMeta(dueDate: string, isDone: boolean): DeadlineMeta {
  const todayStr = toLocalIsoDate(new Date());
  const today = new Date(`${todayStr}T00:00:00`);
  const target = new Date(`${dueDate}T00:00:00`);
  const diffMs = target.getTime() - today.getTime();
  const daysDiff = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (isDone) {
    return { label: 'Selesai', urgency: 'done', daysDiff };
  }
  if (daysDiff < 0) {
    return { label: `Terlambat ${Math.abs(daysDiff)} hari`, urgency: 'overdue', daysDiff };
  }
  if (daysDiff === 0) {
    return { label: 'Hari ini', urgency: 'today', daysDiff };
  }
  if (daysDiff === 1) {
    return { label: 'Besok', urgency: 'tomorrow', daysDiff };
  }
  if (daysDiff <= 3) {
    return { label: `${daysDiff} hari lagi`, urgency: 'soon', daysDiff };
  }
  return { label: `${daysDiff} hari lagi`, urgency: 'upcoming', daysDiff };
}

export function getCurrentMinutesOfDay(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function parseTimeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}
