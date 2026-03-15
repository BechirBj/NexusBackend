import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    // read JWT from cookie
    const token = request.cookies['accessToken'];
    if (!token) throw new UnauthorizedException('No token found');

    // inject token into Authorization header for passport
    request.headers.authorization = `Bearer ${token}`;

    return super.canActivate(context);
  }
}