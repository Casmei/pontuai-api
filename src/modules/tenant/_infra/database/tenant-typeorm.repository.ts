import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import CreateTenantDto from '../http/Dtos/create-tenant.dto';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import { UserTenant, UserTenantRole } from '../../entities/user-tenant.entity';
import { ITenantRepository } from '../../interfaces/tenant.repository';

@Injectable()
export class TenantRepository implements ITenantRepository {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        @InjectRepository(UserTenant)
        private userTenantRepository: Repository<UserTenant>,

    ) { }

    async create({ cnpj, name, segment }: CreateTenantDto): Promise<Tenant> {
        const tenant = this.tenantRepository.create({
            name,
            segment,
            CNPJ: cnpj,
            active: true
        });
        return this.tenantRepository.save(tenant);
    }

    async assignUser(user: JwtPayload, tenant: Partial<Tenant>): Promise<UserTenant> {
        const tenantUser = this.userTenantRepository.create({
            tenant_id: tenant.id,
            external_user_id: user.sub,
            role: UserTenantRole.OWNER
        })
        return this.userTenantRepository.save(tenantUser);
    }
}