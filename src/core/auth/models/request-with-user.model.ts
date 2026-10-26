import { AuthUser } from './auth-user.model';

export type RequestWithUser = {
  user?: AuthUser;
  headers?: Record<string, string | string[] | undefined>;
  body?: Record<string, unknown>;
};
