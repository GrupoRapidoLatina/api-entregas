import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './decorators/current-user.decorator';
import { JwtPayload } from './models/jwt-payload.model';
import { RequestWithUser } from './models/request-with-user.model';
import { TokenService } from './services/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException('Token inválido ou ausente');
    }

    let payload: JwtPayload;
    try {
      payload = this.tokenService.verify(token);
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (payload.purpose === 'password_reset') {
      throw new UnauthorizedException('Token inválido ou ausente');
    }

    const userId = Number(payload.sub);
    if (!Number.isFinite(userId) || userId <= 0) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    this.assertBodyActorMatchesToken(request.body, userId);

    const rawUserType = payload.userType;
    const parsedUserType =
      rawUserType == null ? NaN : Number(rawUserType);

    request.user = {
      userId,
      userType: Number.isFinite(parsedUserType) ? parsedUserType : null,
    };
    return true;
  }

  private extractBearerToken(request: RequestWithUser): string | null {
    const header =
      request.headers?.authorization ?? request.headers?.Authorization;
    const rawHeader = Array.isArray(header) ? header[0] : header;
    if (!rawHeader || typeof rawHeader !== 'string') return null;
    const [scheme, token] = rawHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
    return token.trim();
  }

  private assertBodyActorMatchesToken(
    body: Record<string, unknown> | undefined,
    tokenUserId: number,
  ) {
    if (!body) return;
    const bodyUserId = Number(body.user_id);
    if (!Number.isFinite(bodyUserId) || bodyUserId <= 0) return;
    if (bodyUserId === tokenUserId) return;
    throw new UnauthorizedException('Usuário não autorizado para esta ação');
  }
}
