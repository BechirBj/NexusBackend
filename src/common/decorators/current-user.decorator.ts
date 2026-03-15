import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Extract current user from JWT payload
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // { sub, email }
  },
);
