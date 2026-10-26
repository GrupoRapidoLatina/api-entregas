export function parseOptionalDate(
  value: string | null | undefined,
): Date | null {
  const rawDate = (value ?? '').trim();
  if (!rawDate) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const parsed = new Date(`${rawDate}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateOnly(
  value: Date | string | null | undefined,
): string | null {
  if (value == null || value === '') return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const parsed = parseOptionalDate(String(value));
  return parsed ? parsed.toISOString().slice(0, 10) : String(value);
}

export function formatClock(
  value: Date | string | null | undefined,
): string | null {
  if (value == null || value === '') return null;
  if (value instanceof Date) {
    const hours = value.getUTCHours();
    const minutes = value.getUTCMinutes();
    if (hours === 0 && minutes === 0) return null;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  const match = String(value).trim().match(/(\d{2}):(\d{2})/);
  if (!match) return null;
  return `${match[1]}:${match[2]}`;
}

export function formatDateTime(
  value: Date | string | null | undefined,
): string | null {
  if (value == null || value === '') return null;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 19).replace('T', ' ');
  }
  return String(value);
}
