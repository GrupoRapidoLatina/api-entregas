import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

function messageFromPayload(
  payload: string | object,
  fallback: string,
): string {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return fallback;
  if (!('message' in payload)) return fallback;
  const message = (payload as { message?: string | string[] }).message;
  if (Array.isArray(message)) return message.join('; ');
  if (typeof message === 'string') return message;
  return fallback;
}

function statusAndMessage(exception: unknown): {
  status: number;
  message: string;
} {
  if (exception instanceof HttpException) {
    return {
      status: exception.getStatus(),
      message: messageFromPayload(
        exception.getResponse(),
        exception.message || 'Erro na requisição',
      ),
    };
  }
  if (exception instanceof Prisma.PrismaClientKnownRequestError) {
    return { status: HttpStatus.BAD_REQUEST, message: 'Falha ao acessar os dados.' };
  }
  if (exception instanceof Prisma.PrismaClientInitializationError) {
    return {
      status: HttpStatus.SERVICE_UNAVAILABLE,
      message: 'Banco de dados indisponível.',
    };
  }
  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Erro interno. Tente novamente.',
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<{ requestId?: string; url?: string }>();
    const requestId = req.requestId ?? '-';
    const { status, message } = statusAndMessage(exception);

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(
        `[${requestId}] Prisma ${exception.code} ${req.url ?? ''}`,
      );
    }
    if (exception instanceof Prisma.PrismaClientInitializationError) {
      this.logger.error(`[${requestId}] Prisma init: ${exception.message}`);
    }
    if (
      exception instanceof Error &&
      !(exception instanceof HttpException) &&
      !(exception instanceof Prisma.PrismaClientKnownRequestError) &&
      !(exception instanceof Prisma.PrismaClientInitializationError)
    ) {
      this.logger.error(`[${requestId}] ${exception.name}: ${exception.message}`);
    }
    if (!(exception instanceof Error)) {
      this.logger.error(`[${requestId}] Unknown error`);
    }

    res.status(status).json({
      success: false,
      message,
    });
  }
}
