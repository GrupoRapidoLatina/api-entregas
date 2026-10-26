import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<{
      method?: string;
      url?: string;
      body?: Record<string, unknown>;
      requestId?: string;
      headers: Record<string, string | string[] | undefined>;
    }>();

    const requestId =
      (typeof req.headers['x-request-id'] === 'string' &&
        req.headers['x-request-id']) ||
      randomUUID();
    req.requestId = requestId;

    const started = Date.now();
    const userId = req.body?.user_id ?? null;
    const endpoint = `${req.method ?? 'POST'} ${req.url ?? ''}`;

    this.logger.log(
      JSON.stringify({
        type: 'request',
        requestId,
        endpoint,
        user_id: userId,
        body: req.body,
      }),
    );

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            JSON.stringify({
              type: 'response',
              requestId,
              endpoint,
              user_id: userId,
              ms: Date.now() - started,
            }),
          );
        },
        error: (err: Error) => {
          this.logger.warn(
            JSON.stringify({
              type: 'response_error',
              requestId,
              endpoint,
              user_id: userId,
              ms: Date.now() - started,
              error: err?.message,
            }),
          );
        },
      }),
    );
  }
}
