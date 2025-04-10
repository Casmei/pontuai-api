
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetTenantId = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest() as Request;
        return request.headers["x-tenant-id"];
    },
);