import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { Reflector } from '@nestjs/core';
import { SKIP_TENANT_CHECK } from '../decorator/skip-tenant-check';

@Injectable()
export class IsValidTenantGuard implements CanActivate {
    constructor(@InjectRepository(Tenant) private tenantRepository: Repository<Tenant>, private reflector: Reflector) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const shouldSkipCheck = this.reflector.getAllAndOverride<boolean>(SKIP_TENANT_CHECK, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (shouldSkipCheck) {
            return true;
        }

        const request = context.switchToHttp().getRequest() as Request;
        const tenantId = request.headers["x-tenant-id"];

        return this.tenantRepository.existsBy({ id: tenantId });
    }
}