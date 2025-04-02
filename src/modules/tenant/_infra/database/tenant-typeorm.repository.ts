import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../entities/tenant.entity';
import CreateTenantDto from '../http/Dtos/create-tenant.dto';
import { JwtPayload } from 'src/modules/auth/types/auth.types';
import { TenantUser, UserTenantRole } from '../../entities/tenant-user.entity';
import { ITenantRepository } from '../../interfaces/tenant.repository';
import { PointConfig, TenantConfig } from '../../entities/tenant-config';
import slugify from 'slugify';
import { UpdateTenantSettingsDto } from '../http/Dtos/update-tenant-settings.dto';

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

    async isTenantOwner(user: JwtPayload, tenant: Tenant): Promise<boolean> {
        return await this.tenantUserRepository.existsBy({
            tenant_id: tenant.id,
            external_user_id: user.sub,
            role: UserTenantRole.OWNER,
        });
    }

    async updateSettings(
        settings: UpdateTenantSettingsDto,
        tenant: Tenant,
    ): Promise<void> {
        await this.tenantConfigRepository.update(
            { tenant_id: tenant.id },
            {
                point_config: {
                    ratio: {
                        amount: settings.ratioAmount,
                        moneySpent: settings.ratioMoneySpent,
                    },
                    expirationInDays: settings.expirationInDays,
                    minimumRedemptionValue: settings.minimumRedemptionValue,
                },
            },
        );
    }

    async getByUserId(user: JwtPayload): Promise<Tenant[] | null> {
        return await this.tenantRepository.findBy({
            users: { external_user_id: user.sub },
        });
    }

    async generateDefaultTenantConfig(tenant: Partial<Tenant>): Promise<void> {
        const tenantConfig = this.tenantConfigRepository.create({
            point_config: this.getDefaultTenantConfig(),
            tenant_id: tenant.id,
        });

        await this.tenantConfigRepository.save(tenantConfig);
    }

    async create({ cnpj, name, slug }: CreateTenantDto): Promise<Tenant> {
        if (await this.slugAlreadyExist(slug)) {
            throw new Error('Slug tenant in use!');
        }

        const tenant = this.tenantRepository.create({
            name,
            CNPJ: cnpj,
            active: true,
            slug: slugify(slug),
        });
        return this.tenantRepository.save(tenant);
    }

    async assignUser(
        user: JwtPayload,
        tenant: Partial<Tenant>,
    ): Promise<TenantUser> {
        const tenantUser = this.tenantUserRepository.create({
            tenant_id: tenant.id,
            external_user_id: user.sub,
            role: UserTenantRole.OWNER,
        });
        return this.tenantUserRepository.save(tenantUser);
    }

    private getDefaultTenantConfig(): PointConfig {
        return {
            ratio: {
                amount: 1,
                moneySpent: 1,
            },
            expirationInDays: 90,
            minimumRedemptionValue: 100,
        };
    }

    private slugAlreadyExist(slug: string): Promise<boolean> {
        return this.tenantRepository.existsBy({
            slug,
        });
    }
}
