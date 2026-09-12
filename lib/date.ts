function toDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function todayISO(): string {
  return toISODate(new Date());
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDaysISO(dateStr: string, days: number): string {
  const d = toDate(dateStr);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function formatDateSlash(dateStr: string): string {
  const d = toDate(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

export function formatDateLong(dateStr: string): string {
  const d = toDate(dateStr);
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

export function formatDateTime(dateTimeStr: string): string {
  const d = new Date(dateTimeStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// Positive = overdue by N days, negative = N days remaining, 0 = due today.
export function daysFromToday(dueDateStr: string): number {
  const due = toDate(dueDateStr);
  const today = startOfToday();
  const diffMs = today.getTime() - due.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function isOverdue(dueDateStr: string): boolean {
  return daysFromToday(dueDateStr) > 0;
}

export function isUpcoming(dueDateStr: string, withinDays = 7): boolean {
  const diff = daysFromToday(dueDateStr);
  return diff <= 0 && diff >= -withinDays;
}
