import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const PUBLIC_PATHS = [
  '/api/health',
  '/v3/api-docs',
  '/api-docs',
  '/api-docs-json',
];

@Injectable()
export class KeycloakAuthGuard implements CanActivate {
  private readonly issuer = process.env.KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/pdc-generated';
  private readonly audience = process.env.KEYCLOAK_AUDIENCE ?? 'pdc-generated-api';
  private readonly strict = process.env.KEYCLOAK_STRICT_VALIDATION === 'true';
  private readonly jwks = createRemoteJWKSet(
    new URL(process.env.KEYCLOAK_JWKS_URL ?? this.issuer + '/protocol/openid-connect/certs'),
  );

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (process.env.AUTH_ENABLED === 'false') return true;
    const request = context.switchToHttp().getRequest<{ path?: string; url?: string; headers: Record<string, string | string[] | undefined>; user?: unknown }>();
    const path = request.path ?? request.url ?? '';
    if (PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(publicPath + '/'))) {
      return true;
    }

    const header = request.headers.authorization;
    const value = Array.isArray(header) ? header[0] : header;
    const token = value?.startsWith('Bearer ') ? value.slice('Bearer '.length).trim() : null;
    if (!token) throw new UnauthorizedException('Token de acesso ausente.');

    const { payload } = await jwtVerify(
      token,
      this.jwks,
      this.strict ? { issuer: this.issuer, audience: this.audience } : {},
    );
    request.user = payload;
    return true;
  }
}
