import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { SKIP_AUTH_KEY } from '../decorators/skip-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(isPublic);

    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
