export const COMPROVANTE_MAX_BYTES = 15 * 1024 * 1024;

export const COMPROVANTE_TIMEOUT_MS = 15_000;
export const COMPROVANTE_POLL_INTERVAL_MS = 500;
export const COMPROVANTE_RATE_LIMIT_WINDOW_MS = 60_000;
export const COMPROVANTE_RATE_LIMIT_MAX_REQUESTS = 20;

export const COMPROVANTE_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
] as const;

export const COMPROVANTE_ALLOWED_MIME_TYPE_SET = new Set<string>(
  COMPROVANTE_ALLOWED_MIME_TYPES,
);
