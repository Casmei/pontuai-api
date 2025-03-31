
import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from '../types/auth.types';

export const GetUser = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user as JwtPayload;
    },
);