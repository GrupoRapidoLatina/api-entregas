export function imageUrl(filename?: string | null): string {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  const base = process.env.IMAGE_BASE_URL || '';
  return `${base}${filename}`;
}
