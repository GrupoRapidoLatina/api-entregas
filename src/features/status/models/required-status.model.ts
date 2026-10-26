import type { Status } from '@prisma/client';

export type RequiredStatus = Status & {
  codigo: number;
  microStatus: string;
};
