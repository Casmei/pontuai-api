import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import CreateTenantDto from '../http/Dtos/create-tenant.dto';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import { TenantUser, UserTenantRole } from '../../entities/tenant-user.entity';
import { ITenantRepository } from '../../interfaces/tenant.repository';
import { PointConfig, TenantConfig } from '../../entities/tenant-config';

@Injectable()
export class TenantRepository implements ITenantRepository {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        @InjectRepository(TenantUser)
        private tenantUserRepository: Repository<TenantUser>,
        @InjectRepository(TenantConfig)
        private tenantConfigRepository: Repository<TenantConfig>,

    ) { }

    async getByUserId(user: JwtPayload): Promise<Tenant[] | null> {
        return await this.tenantRepository.findBy({ users: { external_user_id: user.sub } });
    }

    async generateDefaultTenantConfig(tenant: Partial<Tenant>): Promise<void> {
        const tenantConfig = this.tenantConfigRepository.create({
            point_config: this.getDefaultTenantConfig(),
            tenant_id: tenant.id
        });

        await this.tenantConfigRepository.save(tenantConfig);
    }

    async create({ cnpj, name, segment }: CreateTenantDto): Promise<Tenant> {
        const tenant = this.tenantRepository.create({
            name,
            segment,
            CNPJ: cnpj,
            active: true
        });
        return this.tenantRepository.save(tenant);
    }

    async assignUser(user: JwtPayload, tenant: Partial<Tenant>): Promise<TenantUser> {
        const tenantUser = this.tenantUserRepository.create({
            tenant_id: tenant.id,
            external_user_id: user.sub,
            role: UserTenantRole.OWNER
        })
        return this.tenantUserRepository.save(tenantUser);
    }

    private getDefaultTenantConfig(): PointConfig {
        return {
            ratio: {
                amount: 1,
                moneySpent: 1
            },
            expirationInDays: 90,
            minimumRedemptionValue: 100
        }
    }
}