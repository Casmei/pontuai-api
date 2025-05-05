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
    getTenantConfig(tenant: string): Promise<TenantConfig | null> {
        return this.tenantConfigRepository.findOneBy({ tenant_id: tenant })
    }

    async isTenantOwner(user: JwtPayload, tenantId: string): Promise<boolean> {
        return await this.tenantUserRepository.existsBy({
            tenant_id: tenantId,
            external_user_id: user.sub,
            role: UserTenantRole.OWNER,
        });
    }

    async updateSettings(
        settings: UpdateTenantSettingsDto,
        tenantId: string,
    ): Promise<void> {
        await this.tenantConfigRepository.update(
            { tenant_id: tenantId },
            {
                point_config: {
                    pointsForMoneySpent: settings.pointsForMoneySpent,
                    expirationInDays: settings.expirationInDays,
                    minimumValueForWinPoints: settings.minimumValueForWinPoints
                },
                //todo: Colocar settings do whatsapp
            },
        );
    }

    async getByUserId(user: JwtPayload): Promise<Tenant[] | null> {
        return await this.tenantRepository.find({
            where: {
                users: {
                    external_user_id: user.sub,
                },
            },
            relations: ['config'],
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
            minimumValueForWinPoints: 15,
            pointsForMoneySpent: 1,
            expirationInDays: 90,
        };
    }

    private slugAlreadyExist(slug: string): Promise<boolean> {
        return this.tenantRepository.existsBy({
            slug,
        });
    }
}
